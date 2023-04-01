import { DataSource } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../../../.env") });

// noinspection JSUnusedGlobalSymbols
export const CliDataSource = new DataSource({
    type: (process.env.DATABASE_TYPE || "mysql") as MysqlConnectionOptions["type"],
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "root",
    database: process.env.DATABASE_SCHEMA || "elms",
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["migrations/*{.ts,.js}"],
    legacySpatialSupport: false,
    synchronize: false,
    logging: false,
});
