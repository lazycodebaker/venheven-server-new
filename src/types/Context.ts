
// Custom imports 
import { BaseContext } from "@apollo/server"
import { EntityManager, SqlEntityManager, SqliteDriver } from "@mikro-orm/sqlite"
import { Request, Response } from "express"

export interface TContext extends BaseContext {
      request: Request
      response: Response,
      em: SqlEntityManager<SqliteDriver> & EntityManager<any>
}