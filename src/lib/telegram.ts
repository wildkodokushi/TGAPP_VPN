type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type TelegramChat = {
  id: number;
  type?: string;
  title?: string;
  username?: string;
};

type TelegramInitDataUnsafe = {
  user?: TelegramUser;
  chat?: TelegramChat;
};

export type TelegramProfile = {
  userId: number | null;
  chatId: number | null;
  username: string | null;
  fullName: string | null;
  photoUrl: string | null;
};

function parseInitDataRaw(raw: string): TelegramInitDataUnsafe | null {
  try {
    const params = new URLSearchParams(raw);
    const userRaw = params.get("user");
    const chatRaw = params.get("chat");
    const user = userRaw ? (JSON.parse(userRaw) as TelegramUser) : undefined;
    const chat = chatRaw ? (JSON.parse(chatRaw) as TelegramChat) : undefined;
    return { user, chat };
  } catch {
    return null;
  }
}

export function getTelegramProfile(): TelegramProfile {
  const webApp = window.Telegram?.WebApp;
  const unsafeFromApi = webApp?.initDataUnsafe;
  const unsafeFromQuery = webApp?.initData
    ? parseInitDataRaw(webApp.initData)
    : null;
  const unsafeFromUrl = parseInitDataRaw(
    new URLSearchParams(window.location.search).get("tgWebAppData") ?? ""
  );

  const data = unsafeFromApi ?? unsafeFromQuery ?? unsafeFromUrl;
  const user = data?.user;
  const chat = data?.chat;

  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    userId: user?.id ?? null,
    // For our backend identity we must prioritize Telegram user id.
    chatId: user?.id ?? chat?.id ?? null,
    username: user?.username ?? null,
    fullName: fullName || null,
    photoUrl: user?.photo_url ?? null,
  };
}
