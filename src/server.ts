// Author : Anshuman Tiwari ( lazycodebaker )

// Third-party imports

// Custom imports
import startApolloServer from './apollo/server'
import createMicroOrmDatabase from './database/connector'
import logger from './logger/Logging'

const startServer = async (): Promise<void> => {
      try {
            // microOrmDatabase() // Start the database
            await createMicroOrmDatabase().then((options) => {
                  console.log('🚀 Database ready')

                  options.testConnection()
                  // options.createTables()
                  // options.orm.migrator.createInitialMigration()
                  // options.orm.migrator.createMigration()
                  // options.syncModels() 
            })
            logger.info('🚀 Database ready')
            await startApolloServer() // Start the Apollo Server
            //     Start the Apollo Server
      }
      catch (error) {
            console.error('Error starting the server:', error)
            logger.error('Error starting the server:', error)
            process.exit(1) // Exit the process if there's an error starting the server
      }
}

export default startServer

//npx mikro-orm migration:create --initial

// for creating table cli is ? 
// npx mikro-orm schema:update --run 