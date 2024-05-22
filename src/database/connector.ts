
/*
      File : src/index.ts
      Author : Anshuman Tiwari ( lazycodebaker )
      Description : Entry point for the application
      Date Created : 29-10-2023
*/

// Third-party imports
import { MikroORM , SqliteDriver } from '@mikro-orm/sqlite'

// Custom imports 
import microConfig from '../config/mikro-orm.config'
import logger from '../logger/Logging'

type MicroOrmDatabase = () => Promise<{
      orm: MikroORM,
      testConnection: () => Promise<void>,
      syncModels: () => Promise<void>,
      createTables: () => Promise<void>
}>

const createMicroOrmDatabase: MicroOrmDatabase = async () => {

      // Setup MikroORM
      const orm = await MikroORM.init<SqliteDriver>(microConfig)

      // Test the connection
      const testConnection = async () => {
            try {
                  await orm.isConnected()
                  console.log('Connection to the database has been established successfully.')
                  logger.info('Connection to the database has been established successfully.')
            } catch (error) {
                  console.error('Unable to connect to the database:', error)
                  logger.error('Unable to connect to the database:', error)
            }
      }

      // Sync the models with the database
      const syncModels = async () => {
            try {
                  await orm.getMigrator().up()
                  console.log('Models synced with the database successfully.')
                  logger.info('Models synced with the database successfully.')
            } catch (error) {
                  console.error('Unable to sync models with the database:', error)
                  logger.error('Unable to sync models with the database:', error)
            }
      }

      // This will create tables according to your model definitions
      const createTables = async () => {
            try {
                  await orm.getSchemaGenerator().createSchema()
                  console.log('Tables created successfully.')
                  logger.info('Tables created successfully.')
            } catch (error) {
                  console.error('Unable to create tables:', error)
                  logger.error('Unable to create tables:', error)
            }
      }

      return {
            orm,
            testConnection,
            syncModels,
            createTables
      }
}

export default createMicroOrmDatabase