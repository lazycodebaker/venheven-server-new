import { CorsOptions } from "cors"

export type Settings = {
      APPNAME: string
      ENVIRONMENT: 'production' | 'development' | 'test'
      server: {
            PORT: number | undefined
            API_PREFIX: string
      }
      cors : CorsOptions
      database: { 
            PATH: string
            migration :{
                  PATH : string
            }
      }
      auth: {
            JWT_SECRET: string
      }
      externalApi?: {
            paymentGatewayApiKey: string
      }
      email: {
            SMTP_HOST: string
            SMTP_PORT: string | number
            SMTP_USER: string
            SMTP_PASSWORD: string
      }
      features: {
            enableProductReviews: boolean
            enablePromotions: boolean
      }
      logs: {
            INFO_FILE : string
            ERROR_FILE : string
            WARN_FILE : string
      }
}
