export const SERVER_PORT = Number(process.env.PORT || 8081);

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:8081";
export const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const ACB_HISTORY_API_URL = process.env.ACB_HISTORY_API_URL || "";
export const ACB_CRON_SCHEDULE = process.env.ACB_CRON_SCHEDULE || "*/2 * * * *";
export const ENABLE_ACB_CRON = process.env.ENABLE_ACB_CRON !== "false";
