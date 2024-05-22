
import { ApolloServer, BaseContext } from '@apollo/server'
import { schema } from '../graphQL/schema'
import { settings } from '../config/settings'
import createMicroOrmDatabase from '../database/connector'
import { TContext } from '../types/Context'
import logger from '../logger/Logging'
import http from 'http'
import app from '../app'

import cors from 'cors'

import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

const startApolloServer = async () => {
      try {
            const httpServer = http.createServer(app);

            const server: ApolloServer<BaseContext> = new ApolloServer({
                  schema: schema,
                  /*
                        This plugin is used to enable graceful server shutdown.
                        When you use ApolloServerPluginDrainHttpServer, it helps to handle the graceful shutdown of 
                        the Apollo Server when the Node.js HTTP server is being shut down. This is useful in scenarios like
                        when you need to restart or stop the server without abruptly terminating in-progress requests.
                  */
                  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
            })

            const PORT = settings.server.PORT

            const em = (await createMicroOrmDatabase().then((options) => options.orm)).em

            await server.start()

            app.use(cors<cors.CorsRequest>(settings.cors), expressMiddleware(server, {
                  context: async ({ req, res }) => ({ em: em.fork(), request: req, response: res } as TContext)
            }))

            await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

            console.log(`🚀 Server ready `)
            logger.info(`🚀 Apollo GraphQL Server ready `)
            console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
      }
      catch (error: unknown) {
            console.error('Error starting the server:', error)
            logger.error('Error starting the server:', error)
            process.exit(1)
      }
}


export default startApolloServer