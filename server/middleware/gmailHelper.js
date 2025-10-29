import { google } from "googleapis";
import { getAuthenticatedClient } from "./googleapi.js";

/**
 * Пример: Получение последних писем из Gmail
 * @param {string} refreshToken - Google refresh token пользователя
 * @param {number} maxResults - Максимальное количество писем
 * @returns {Promise<Array>} Список писем
 */
export const getRecentEmails = async (refreshToken, maxResults = 10) => {
  try {
    // Получаем аутентифицированный OAuth2 клиент
    const oauth2Client = getAuthenticatedClient(refreshToken);

    // Создаем Gmail API клиент
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Получаем список писем
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: maxResults,
    });

    const messages = response.data.messages || [];
    const emailDetails = [];

    // Получаем детали каждого письма
    for (const message of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });
      emailDetails.push(email.data);
    }

    return emailDetails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
};

/**
 * Поиск писем от определенного отправителя
 * @param {string} refreshToken - Google refresh token пользователя
 * @param {string} fromEmail - Email отправителя
 * @returns {Promise<Array>} Список найденных писем
 */
export const searchEmailsFromSender = async (refreshToken, fromEmail) => {
  try {
    const oauth2Client = getAuthenticatedClient(refreshToken);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      q: `from:${fromEmail}`,
    });

    return response.data.messages || [];
  } catch (error) {
    console.error("Error searching emails:", error);
    throw error;
  }
};

/**
 * Получение информации о пользователе Google
 * @param {string} refreshToken - Google refresh token пользователя
 * @returns {Promise<Object>} Информация о пользователе
 */
export const getUserInfo = async (refreshToken) => {
  try {
    const oauth2Client = getAuthenticatedClient(refreshToken);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

    const response = await oauth2.userinfo.get();
    return response.data;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};

/**
 * Извлечение текста из письма
 * @param {Object} message - Объект письма от Gmail API
 * @returns {string} Текст письма
 */
const getEmailBody = (message) => {
  let plainBody = "";
  let htmlBody = "";

  const extractFromPart = (part) => {
    if (part.body && part.body.data) {
      const decoded = Buffer.from(part.body.data, "base64").toString("utf-8");
      if (part.mimeType === "text/plain") {
        plainBody = decoded;
      } else if (part.mimeType === "text/html") {
        htmlBody = decoded;
      }
    }

    // Рекурсивно проверяем вложенные части
    if (part.parts) {
      part.parts.forEach(extractFromPart);
    }
  };

  if (message.payload.body && message.payload.body.data) {
    plainBody = Buffer.from(message.payload.body.data, "base64").toString(
      "utf-8"
    );
  }

  if (message.payload.parts) {
    message.payload.parts.forEach(extractFromPart);
  }

  // Предпочитаем plain text, но если его нет - используем HTML (удаляя теги)
  let body = plainBody || htmlBody;

  // Если только HTML, убираем теги для упрощения поиска
  if (!plainBody && htmlBody) {
    body = htmlBody
      .replace(/<style[^>]*>.*?<\/style>/gis, "")
      .replace(/<script[^>]*>.*?<\/script>/gis, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ");
  }

  return body;
};

/**
 * Поиск кода Steam Guard в письме
 * @param {string} refreshToken - Google refresh token пользователя
 * @param {number} maxAttempts - Максимальное количество попыток поиска
 * @param {number} delayMs - Задержка между попытками в миллисекундах
 * @returns {Promise<string>} Код Steam Guard
 */
export const getSteamGuardCode = async (
  refreshToken,
  maxAttempts = 10,
  delayMs = 3000
) => {
  try {
    const oauth2Client = getAuthenticatedClient(refreshToken);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Ждем 10 секунд перед первой проверкой, чтобы письмо успело дойти
    console.log("⏳ Ожидание 10 секунд для того чтобы письмо дошло...");
    await new Promise((resolve) => setTimeout(resolve, 10000));

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(
        `🔍 Попытка ${attempt}/${maxAttempts}: Ищем письмо от Steam...`
      );

      // Попробуем несколько вариантов поиска (более гибко)
      const searchQueries = [
        `from:noreply@steampowered.com`,
        `from:steampowered.com`,
      ];

      let foundMessages = [];

      for (const query of searchQueries) {
        try {
          const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 5,
          });

          if (response.data.messages && response.data.messages.length > 0) {
            console.log(
              `✓ Найдено ${response.data.messages.length} писем по запросу: "${query}"`
            );
            foundMessages = response.data.messages;
            break;
          }
        } catch (err) {
          console.log(`⚠️ Ошибка при поиске по запросу "${query}"`);
        }
      }

      if (foundMessages.length > 0) {
        // Берем самое первое (новое) письмо
        const latestMessage = await gmail.users.messages.get({
          userId: "me",
          id: foundMessages[0].id,
        });

        // Проверяем время письма
        const messageTime = parseInt(latestMessage.data.internalDate);
        const now = Date.now();
        const ageMinutes = Math.floor((now - messageTime) / 60000);

        // Получаем заголовки
        const headers = latestMessage.data.payload.headers;
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";

        // Извлекаем текст письма
        const emailBody = getEmailBody(latestMessage.data);

        // Специальный поиск в HTML - ищем код в ячейке таблицы с большим шрифтом
        const findHtmlPart = (parts) => {
          if (!parts) return null;
          for (const part of parts) {
            if (part.mimeType === "text/html" && part.body && part.body.data) {
              return part;
            }
            if (part.parts) {
              const found = findHtmlPart(part.parts);
              if (found) return found;
            }
          }
          return null;
        };

        const htmlPart = latestMessage.data.payload.parts
          ? findHtmlPart(latestMessage.data.payload.parts)
          : latestMessage.data.payload.mimeType === "text/html" &&
            latestMessage.data.payload.body
          ? latestMessage.data.payload
          : null;

        if (htmlPart && htmlPart.body && htmlPart.body.data) {
          const html = Buffer.from(htmlPart.body.data, "base64").toString(
            "utf-8"
          );

          console.log("\n🔍 Ищем код в HTML...");

          // Несколько паттернов для поиска кода Steam Guard
          const htmlPatterns = [
            // 1. Код в ячейке с большим шрифтом (48px)
            /font-size:\s*4[0-9]px[^>]*>[\s\n\r\t]*([A-Z0-9]{5})[\s\n\r\t]*</i,
            // 2. Код в ячейке таблицы с синим цветом (#3a9aed - цвет Steam)
            /#3a9aed[^>]*>[\s\n\r\t]*([A-Z0-9]{5})[\s\n\r\t]*</i,
            // 3. Код в любой ячейке таблицы (td) с жирным шрифтом
            /font-weight:\s*bold[^>]*>[\s\n\r\t]*([A-Z0-9]{5})[\s\n\r\t]*</i,
            // 4. Просто код в td с большим шрифтом и центрированием
            /text-align:\s*center[^>]*font-size:\s*4[0-9]px[^>]*>[\s\n\r\t]*([A-Z0-9]{5})[\s\n\r\t]*</i,
          ];

          for (const pattern of htmlPatterns) {
            const match = html.match(pattern);
            if (match && match[1]) {
              const code = match[1].trim().toUpperCase();
              console.log("✓ Код найден в HTML:", code);
              return code;
            }
          }

          console.log(
            "⚠️ Код не найден по HTML паттернам, пробуем поиск по тексту..."
          );
        }

        // Ищем код в очищенном тексте - любые 5 букв/цифр подряд
        const codeMatches = emailBody.match(/\b[A-Za-z0-9]{5}\b/g);

        if (codeMatches && codeMatches.length > 0) {
          console.log(
            `\n🔍 Найдены потенциальные коды (5 символов):`,
            codeMatches
          );

          // Берем первый найденный код
          const code = codeMatches[0].toUpperCase();
          console.log("✓ Используем код:", code);
          return code;
        }

        console.log("❌ Не найдено последовательностей из 5 символов");

        // Если письмо старше 15 минут, пропускаем его
        if (ageMinutes > 15) {
          console.log(
            `⚠️ Письмо слишком старое (${ageMinutes} мин.), продолжаем поиск...`
          );
        } else {
          // Письмо свежее, но код не найден - что-то не так
          console.log(
            "⚠️ Письмо свежее, но код не найден. Возможно, письмо не содержит код?"
          );
        }
      } else {
        console.log("❌ Письма от Steam не найдены");

        // Для отладки: покажем последние 5 писем
        if (attempt === 1) {
          try {
            const recentEmails = await gmail.users.messages.list({
              userId: "me",
              maxResults: 5,
            });

            if (recentEmails.data.messages) {
              console.log("\n📬 Последние 5 писем в почте:");
              for (const msg of recentEmails.data.messages) {
                const details = await gmail.users.messages.get({
                  userId: "me",
                  id: msg.id,
                  format: "metadata",
                  metadataHeaders: ["From", "Subject", "Date"],
                });
                const headers = details.data.payload.headers;
                const from =
                  headers.find((h) => h.name === "From")?.value || "Unknown";
                const subject =
                  headers.find((h) => h.name === "Subject")?.value ||
                  "No subject";
                console.log(`   • ${from} - ${subject}`);
              }
            }
          } catch (err) {
            console.log(
              "Не удалось получить список последних писем:",
              err.message
            );
          }
        }
      }

      if (attempt < maxAttempts) {
        console.log(
          `⏳ Ждем ${delayMs / 1000} секунд перед следующей попыткой...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Не удалось найти письмо с кодом Steam Guard");
  } catch (error) {
    console.error("Ошибка при получении кода Steam Guard:", error);
    throw error;
  }
};
