import { LoginSession, EAuthTokenPlatformType } from "steam-session";
import { readFileSync, writeFileSync } from "fs";
import readline from "readline";

// Функция для чтения ввода из консоли
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

// Функция для первого входа (получение refresh token)
async function firstLogin() {
  const session = new LoginSession(EAuthTokenPlatformType.SteamClient);

  // Обработка событий
  session.on("steamGuardMachineToken", (token) => {
    console.log("✓ Получен machine token:", token);
    // Сохраняем machine token для будущих входов, если он есть
    if (token) {
      writeFileSync("machine_token.txt", token);
      console.log("✓ Machine token сохранен в файл");
    }
  });

  session.on("error", (err) => {
    console.log("Ошибка:", err);
  });

  try {
    console.log("🔐 Начинаем процесс входа в Steam...");

    const result = await session.startWithCredentials({
      accountName: "breakersboy3",
      password: "xaFNgT8a",
    });

    if (result.actionRequired) {
      console.log("\n⚠️  Требуется дополнительное действие:");
      console.log("Доступные действия:", result.validActions);

      // Проверяем тип действия по type
      const emailAction = result.validActions.find(
        (action) => action.type === 2
      );
      const guardAction = result.validActions.find(
        (action) => action.type === 3
      );

      // Если нужен код Steam Guard из email (type: 2)
      if (emailAction) {
        const emailDomain = emailAction.detail || "вашего email";
        const code = await askQuestion(
          `\n📧 Введите код из email (${emailDomain}): `
        );
        console.log("⏳ Отправляем код...");
        await session.submitSteamGuardCode(code);
      }

      // Если нужен код Steam Guard из приложения (type: 3)
      if (guardAction) {
        const code = await askQuestion(
          "\n📱 Введите код из Steam Guard (приложение): "
        );
        console.log("⏳ Отправляем код...");
        await session.submitSteamGuardCode(code);
      }
    }

    // Ждем успешной аутентификации
    await new Promise((resolve, reject) => {
      session.on("authenticated", resolve);
      session.on("error", reject);
    });

    console.log("✓ Успешная аутентификация!");
    console.log("✓ Refresh Token:", session.refreshToken);
    console.log("✓ Steam ID:", session.steamID);

    // Сохраняем refresh token для последующих входов
    writeFileSync("refresh_token.txt", session.refreshToken);
    console.log("✓ Refresh token сохранен в файл refresh_token.txt");
  } catch (error) {
    console.error("Ошибка при входе:", error);
  }
}

// Функция для последующих входов (используя сохраненный refresh token)
async function loginWithRefreshToken() {
  try {
    const refreshToken = readFileSync("refresh_token.txt", "utf-8").trim();

    const session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    session.refreshToken = refreshToken;

    await session.refreshAccessToken();

    console.log("✓ Вход с refresh token успешен!");
    console.log("✓ Steam ID:", session.steamID);
    console.log("✓ Access Token:", session.accessToken);
  } catch (error) {
    console.error("Ошибка при входе с refresh token:", error);
  }
}

// Раскомментируйте нужную функцию:
firstLogin(); // Для первого входа
// loginWithRefreshToken(); // Для последующих входов с сохраненным токеном
