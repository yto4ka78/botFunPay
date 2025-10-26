import { LoginSession, EAuthTokenPlatformType } from "steam-session";
import { sequelize } from "../models/index.js";
import { getSteamGuardCode } from "./gmailHelper.js";

export async function firstLogin(idAccount) {
  const session = new LoginSession(EAuthTokenPlatformType.SteamClient);

  session.on("steamGuardMachineToken", (token) => {
    console.log("✓ Получен machine token:", token);
  });

  session.on("error", (err) => {
    console.log("Ошибка:", err);
  });

  try {
    // Сначала получаем аккаунт из БД
    const steamAccount = await sequelize.models.SteamAccount.findByPk(
      idAccount
    );

    if (!steamAccount) {
      throw new Error("Steam account not found");
    }

    // Расшифровываем данные
    const login = steamAccount.steamLogin;
    const password = steamAccount.getDecryptedSteamPassword();

    if (!password) {
      throw new Error("Failed to decrypt steam password");
    }

    const result = await session.startWithCredentials({
      accountName: login,
      password: password,
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
        // Проверяем, есть ли у нас refreshToken для Gmail
        if (steamAccount.refresh_token) {
          console.log("🔓 Используем Gmail API для получения кода...");

          try {
            // Расшифровываем refreshToken (используем метод модели)
            const decryptedRefreshToken =
              steamAccount.getDecryptedRefreshToken();

            if (!decryptedRefreshToken) {
              return console.log("Не удалось расшифровать Gmail refresh token");
            }
            // Автоматически получаем код из Gmail
            const code = await getSteamGuardCode(decryptedRefreshToken);
            console.log("⏳ Отправляем код...");
            await session.submitSteamGuardCode(code);
          } catch (error) {
            console.error(
              "❌ Ошибка при получении кода через Gmail API:",
              error
            );
          }
        } else {
          return console.log(
            `Нет доступа к почте ${steamAccount.email}. Необходим Gmail refresh token.`
          );
        }
      }

      // Если нужен код Steam Guard из приложения (type: 3)
      if (guardAction) {
        return console.log(
          "Требуется код из Steam Guard приложения. Автоматическое получение не поддерживается."
        );
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

    // Сохраняем Steam refresh token в базу данных
    await steamAccount.update({
      steam_refresh_token: session.refreshToken,
      steam_id: session.steamID.toString(),
    });

    console.log("✓ Steam refresh token сохранен в базе данных");

    return {
      success: true,
    };
  } catch (error) {
    await steamAccount.destroy();
    console.error("❌ Ошибка при входе:", error);
    return {
      success: false,
      message: "Error in firstLogin",
    };
  }
}

export default firstLogin;
