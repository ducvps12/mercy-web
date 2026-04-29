const isProduction = process.env.NODE_ENV === "production";

export const SERVER_PORT = Number(process.env.PORT || 8081);

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in production environment");
}

export const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
export const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const ACB_HISTORY_API_URL = process.env.ACB_HISTORY_API_URL || "";
export const ACB_CRON_SCHEDULE = process.env.ACB_CRON_SCHEDULE || "*/2 * * * *";
export const ENABLE_ACB_CRON = isProduction && process.env.ENABLE_ACB_CRON !== "false";
