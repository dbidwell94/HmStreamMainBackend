import "reflect-metadata";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import models from "./models";

const connectionOptions: ConnectionOptions =
  process.env.NODE_ENV === "development"
    ? {
        type: "postgres",
        host: "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "hmstream",
        entities: models,
        synchronize: true,
        name: "development",
      }
    : {
        type: "postgres",
        url: process.env.DATABASE_URL,
      };

const connection: Promise<Connection> = createConnection(connectionOptions);

export default connection;
