const $ = (s) => document.querySelector(s);
const API_URL = "http://localhost:5000/api/funpay/addaccount";

$("#connect").addEventListener("click", async () => {
  $("#log").textContent = "Reading cookies…";
  try {
    // 1) Читаем все куки домена funpay.com (нужно permission: cookies + host_permissions)
    const cookies = await chrome.cookies.getAll({ domain: "funpay.com" });
    const golden = cookies.find((c) => c.name.toLowerCase() === "golden_key");
    if (!golden?.value) {
      $("#log").textContent =
        "golden_key не найден. Войдите в https://funpay.com/ и попробуйте снова.";
      await chrome.tabs.create({ url: "https://funpay.com/" });
      return;
    }

    $("#log").textContent = "Sending to backend…";

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goldenKey: golden.value }),
    });

    if (!res.ok) {
      $("#log").textContent = `Backend error: ${res.status}`;
      return;
    }

    const data = await res.json().catch(() => ({}));
    $("#log").textContent = `Done ✅\n` + JSON.stringify(data, null, 2);
  } catch (e) {
    $("#log").textContent = "Error: " + (e?.message || e);
  }
});
