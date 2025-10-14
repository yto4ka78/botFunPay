const $ = (s) => document.querySelector(s);

// ВЫБЕРИ правильный origin, который реально держит твои куки авторизации:
const SITE_MATCH = /^(https?:\/\/(localhost:5000|your-domain\.tld))\//i;
const SITE_START_URL = "http://localhost:5000/"; // откроем этот URL, если вкладки нет
const SITE_REL_ENDPOINT = "/api/funpay/addaccount"; // запрос пойдёт из вкладки сайта

const FUNPAY_ORIGIN = "https://funpay.com/";

$("#connect").addEventListener("click", async () => {
  $("#log").textContent = "Reading cookies…";
  try {
    // 1) Проверим, что открыта вкладка funpay и возьмём golden_key
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (
      !activeTab ||
      !/^https?:\/\/([^/]+\.)?funpay\.com/i.test(activeTab.url || "")
    ) {
      throw new Error("Открой вкладку с https://funpay.com/ и попробуй снова.");
    }

    const goldenCookie = await chrome.cookies.get({
      url: FUNPAY_ORIGIN,
      name: "golden_key",
    });
    const goldenKey = goldenCookie?.value;
    if (!goldenKey) {
      $("#log").textContent =
        "golden_key не найден. Войдите в https://funpay.com/ и попробуйте снова.";
      return;
    }

    // 2) Прочитаем localStorage в контексте funpay (если нужно)
    const funpayEmail = await getLocalStorageFromFunpay("_ym36956765_il"); // это не e-mail, см. примечание ниже

    // 3) Найдём/откроем вкладку сайта и отправим запрос ИЗ НЕЁ
    const siteTab = await ensureSiteTab(); // <-- теперь возвращает вкладку
    $("#log").textContent = "Sending to backend…";

    const result = await postFromSiteTab(siteTab.id, SITE_REL_ENDPOINT, {
      goldenKey,
      funpayEmail, // можно удалить, если не нужен
    });

    if (!result.ok) {
      // HTTP-ошибка: возьми код и message из тела
      if (result.message === "No access") {
        $("#log").textContent = "Join to tou account in bfp.com";
      } else {
        $("#log").textContent = ` ${result.message || "Unknown error :("}`;
      }
      return;
    }

    $("#log").textContent = `Done ✅! \n${result.message}`;
  } catch (e) {
    $("#log").textContent = "Error: " + (e?.message || e);
  }
});

async function getLocalStorageFromFunpay(key) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https?:\/\/([^/]+\.)?funpay\.com/i.test(tab.url || "")) {
    throw new Error("Открой вкладку с https://funpay.com/ и попробуй снова.");
  }
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    world: "MAIN",
    func: (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    args: [key],
  });
  return result ?? null;
}

async function ensureSiteTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  let tab = tabs.find((t) => SITE_MATCH.test(t.url || ""));
  if (!tab) {
    tab = await chrome.tabs.create({ url: SITE_START_URL, active: true });
  }
  await waitForComplete(tab.id);
  return tab;
}

function waitForComplete(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (t) => {
      if (t.status === "complete") return resolve();
      const onUpdated = (id, info) => {
        if (id === tabId && info.status === "complete") {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(onUpdated);
    });
  });
}

// ВАЖНО: fetch выполняем ВНУТРИ вкладки сайта — куки приклеятся автоматически
async function postFromSiteTab(tabId, relPath, payload) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: async (rel, body, xsrfCookieName, xsrfHeaderName, warmupUrl) => {
      // вспомогалка для чтения cookie по имени
      const getCookie = (name) => {
        const m = document.cookie.match(
          new RegExp(
            `(?:^|; )${name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}=([^;]*)`
          )
        );
        return m ? decodeURIComponent(m[1]) : null;
      };

      // 1) убедимся, что XSRF-кука есть (если нет — дернем "прогрев" GET)
      let xsrf = getCookie(xsrfCookieName);
      if (!xsrf && warmupUrl) {
        try {
          await fetch(warmupUrl, { credentials: "include" }); // сервер на этом GET должен поставить XSRF-TOKEN
          xsrf = getCookie(xsrfCookieName);
        } catch {}
      }

      const headers = { "Content-Type": "application/json" };
      if (xsrf) headers[xsrfHeaderName] = xsrf; // <— критично для прохождения requireAuth

      try {
        const res = await fetch(rel, {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify(body),
        });
        const { status, ok } = res;

        // если 204 — тела нет
        if (status === 204) {
          return { ok, status, message: null, data: null };
        }

        // пробуем достать JSON или текст
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json")
          ? await res.json().catch(() => ({}))
          : await res.text();

        // единообразно возвращаем результат
        const message = typeof data === "string" ? data : data?.message;

        return { ok, status, message, data };
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    },
    // имена должны совпасть с мидлварью
    args: [
      "/api/funpay/addaccount",
      payload,
      "XSRF-TOKEN",
      "x-xsrf-token",
      "/auth/csrf-warmup",
    ],
  });
  return result;
}
