
// Third-party imports
import { MikroORM , SqliteDriver, defineConfig } from "@mikro-orm/sqlite";

// Custom imports
import {importModels} from "../models/index";
import { settings } from "./settings";

// Path to the SQLite database file
const dbPath = settings.database.PATH

const models = importModels();

// Initialize MikroORM
export default defineConfig({
      migrations : {
            path : settings.database.migration.PATH, 
      },
      entities:  Object.values(models),
      type: 'sqlite',
      dbName: dbPath,
      // dbName: settings.database.name,
      // clientUrl : "postgres://default:zVs8RYA4MKoT@ep-broad-union-06599720.us-east-1.postgres.vercel-storage.com:5432/verceldb",
      debug: settings.ENVIRONMENT === 'development',
      driver: SqliteDriver,
      logger: console.log,
      tsNode: true,
      cache: {
            enabled: true,
            pretty: true,
      },
}) as Parameters<typeof MikroORM.init<SqliteDriver>>[0];