import axios from "axios";
import http from "node:http";
import https from "node:https";

export const bot = axios.create({
  baseURL: `${process.env.API_MANAGER_BFP}/`,
  timeout: 5000,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50 }),
  headers: { "x-service-key": process.env.S2S_KEY },
});

bot.interceptors.response.use(
  (r) => r,
  async (err) => {
    const cfg = err.config;
    cfg.__retryCount = (cfg.__retryCount ?? 0) + 1;
    const retriable = !err.response || err.response.status >= 500;
    if (retriable && cfg.__retryCount <= 2) {
      await new Promise((r) => setTimeout(r, 300 * cfg.__retryCount));
      return bot(cfg);
    }
    return Promise.reject(err);
  }
);
