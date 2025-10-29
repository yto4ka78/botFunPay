const $ = (s) => document.querySelector(s);
const SITE_MATCH = /^(https?:\/\/(localhost:5000|your-domain\.tld))\//i;
const SITE_START_URL = "http://localhost:5000";
const SITE_REL_ENDPOINT = "/api/funpay/addaccount";

const FUNPAY_ORIGIN = "https://funpay.com/";
const connectButton = document.getElementById("connect");
const logContainer = document.getElementById("log");
const funpayNameInput = document.getElementById("funpayName");
connectButton.addEventListener("click", async () => {
  logContainer.textContent = "Reading cookies…";
  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!activeTab.url.includes("funpay.com")) {
      logContainer.textContent = "Open FunPay website and try again";
      return;
    }
    const goldenCookie = await chrome.cookies.get({
      url: FUNPAY_ORIGIN,
      name: "golden_key",
    });
    const goldenKey = goldenCookie?.value;
    if (!goldenKey) {
      logContainer.textContent = "Login to FunPay and try again.";
      return;
    }

    const funpayName = funpayNameInput.value;
    if (!funpayName) {
      logContainer.textContent = "Please enter your FunPay name";
      return;
    }
    const siteTab = await ensureSiteTab();
    logContainer.textContent = "Sending to backend…";
    console.log(siteTab, funpayName, goldenKey);
    const result = await sendToBackend(siteTab, funpayName, goldenKey);
    if (!result.success) {
      logContainer.textContent = result.message;
      return;
    }
    logContainer.textContent = `Done ✅! \n${result.message}`;
  } catch (e) {
    logContainer.textContent = "Error: " + (e?.message || e);
  }
});

async function ensureSiteTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  let tab = tabs.find((t) => SITE_MATCH.test(t.url || ""));
  if (!tab) {
    tab = await chrome.tabs.create({ url: SITE_START_URL, active: true });
  }
  await waitForComplete(tab.id);
  return tab;
}

async function openBFP() {
  let tab;
  const [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!activeTab.url.includes(SITE_START_URL)) {
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
async function sendToBackend(siteTab, funpayName, goldenKey) {
  const results = await chrome.scripting.executeScript({
    target: { tabId: siteTab.id },
    func: async (endpoint, data) => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        return await response.json();
      } catch (error) {
        return {
          success: false,
          message: `Request failed: ${error.message}`,
        };
      }
    },
    args: [SITE_START_URL + SITE_REL_ENDPOINT, { funpayName, goldenKey }],
  });
  return results[0].result;
}
