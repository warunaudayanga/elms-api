import * as dotenv from "dotenv";

dotenv.config({
    path: "../../../.env",
});

export const relations = ["createdBy", "updatedBy", "deletedBy"];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => ({
    app: {
        port: Number(process.env.APP_PORT) || 3000,
        adminPassword: process.env.APP_ADMIN_DEFAULT_PASSWORD || "admin@123",
        allowedOrigins: String(process.env.APP_ALLOWED_ORIGINS).split(",") || [],
    },
    cookies: {
        secret: process.env.APP_COOKIE_SECRET || "",
        sameSite: (process.env.APP_COOKIE_SAME_SITE || "none") as boolean | "none" | "lax" | "strict",
        secure: process.env.APP_COOKIE_INSECURE !== "true",
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        secretExp: process.env.JWT_SECRET_EXP,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshSecretExp: process.env.JWT_REFRESH_SECRET_EXP,
    },
    database: {
        type: process.env.DATABASE_TYPE || "mysql",
        host: process.env.DATABASE_HOST || "localhost",
        user: process.env.DATABASE_USER || "root",
        password: process.env.DATABASE_PASSWORD || "root",
        schema: process.env.DATABASE_SCHEMA || "elms",
        port: Number(process.env.DATABASE_PORT) || 3306,
        charset: "utf8mb4",
        synchronize: process.env.DATABASE_SYNC === "true",
        baseRelations: relations,
    },
    redis: {
        prefix: process.env.REDIS_PREFIX || "",
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        ttl: Number(process.env.REDIS_CACHE_TTL) || 7890000,
        uri: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
    },
    logs: {
        fileName: process.env.LOG_FILE || "errors",
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 465,
        secure: true,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    pushover: {
        url: process.env.PUSHOVER_URL,
        user: process.env.PUSHOVER_USER,
        token: process.env.PUSHOVER_TOKEN,
        errorToken: process.env.PUSHOVER_ERROR_TOKEN,
    },
    onesignal: {
        appId: process.env.ONESIGNAL_APP_ID,
        restApiKey: process.env.ONESIGNAL_API_KEY,
    },
    regex: {
        year: new RegExp(/^[1-9]\d{3,}$/),
        time: new RegExp(/^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$/),
        dateOnly: new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
        pollCode: new RegExp(/^[-_\w]+$/),
    },
});