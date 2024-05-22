
/*
      File : src/config/settings.ts
      Author : Anshuman Tiwari ( lazycodebaker )
      Description : Application settings
      Date Created : 29-10-2023
      Last Modified : 29-10-2023
*/

// Third-party imports
import dotenv from 'dotenv';
import path from 'path';

// Custom imports
import { Settings } from "../types/settings";

dotenv.config();

// dbpath : /Users/lazycodebaker/Documents/web/etoffe/server/src/database/database.sqlite3
// this file is in   /Users/lazycodebaker/Documents/web/etoffe/server/src/config/settings.ts

export const settings: Settings = {
      // General application settings
      APPNAME: 'Venheven',

      ENVIRONMENT: process.env.NODE_ENV as 'production' | 'development',

      // Server settings
      server: {
            PORT: process.env.PORT ? parseInt(process.env.PORT) : 8000,
            API_PREFIX: process.env.APIPREFIX?.toString() || '/api/',
      },

      cors: {
            origin: [
                  '*',
                  'http://localhost:3000'
            ],
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
            credentials: true
      },

      // Database settings
      database: {
            PATH: path.join(__dirname, '../database/database.sqlite3'),
            migration: {
                  PATH: path.join(__dirname, '../database/migrations'),
            },
      },

      // Authentication and authorization settings
      auth: {
            JWT_SECRET: process.env.JWT_SECRET!,
      },

      // Third-party API settings
      //   externalApi: {
      //       paymentGatewayApiKey: process.env.PAYMENT_API_KEY,
      //},

      // Email settings
      email: {
            SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
            SMTP_PORT: process.env.SMTP_PORT || 587,
            SMTP_USER: process.env.SMTP_USER || 'anshumantiwaridec@gmail.com',
            SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'unfd idnx lhju eldm',
      },

      // Advanced feature toggles
      features: {
            enableProductReviews: true,
            enablePromotions: true,
      },

      // Logging File Path 
      logs: {
            INFO_FILE: path.join(__dirname, '../logger/logs/info.log'),
            ERROR_FILE: path.join(__dirname, '../logger/logs/error.log'),
            WARN_FILE: path.join(__dirname, '../logger/logs/warn.log'),
      },
};
