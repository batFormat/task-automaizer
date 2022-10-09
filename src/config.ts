export interface Config {
  telegramToken: string;
  telegramChatId: string;
  notionToken: string;
  userId: string;
  databaseId: string;
}

const telegramToken = process.env.TELEGRAM_TOKEN || '';
const telegramChatId = process.env.TELEGRAM_CHAT_ID || '';
const notionToken = process.env.NOTION_TOKEN || '';
const userId = process.env.USER_ID || '';
const databaseId = process.env.DATABASE_ID || '';

const config: Config = {
  telegramToken,
  telegramChatId,
  notionToken,
  userId,
  databaseId,
};

export default config;
