import { Api, Runner } from "funpay-js-api";

Api.setConfig("FUNPAY_GOLDEN_KEY");

Runner.on("orders_counters", async () => {
  const newOrders = await Api.getNewOrders();
  console.log("Новые заказы:", newOrders);
});

Runner.on("messages", (msg) => {
  console.log("Новое сообщение:", msg);
});

Runner.run();
