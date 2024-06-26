
// Third-Party Imports
import { GraphQLFieldConfig, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

// Custom Imports

import { User } from "../../models/User";
import { UserSchema } from "../typedefs/User";
import { TContext } from "../../types/Context";
import { tokenVerify } from "../../utils/tokenVerify";
import { UserType } from "../../types/User";

const Users: {
      type: GraphQLList<typeof UserSchema>,
      resolve: (_: any, args: any, context: TContext) => Promise<any[]>
} & GraphQLFieldConfig<any, TContext> = {
      type: new GraphQLList(UserSchema),
      resolve: async (_, args, context: TContext): Promise<any[]> => {
            const users: UserType[] = await context.em.fork().find(User, {})!;
            return users;
      }
};

const UserById: {
      type: typeof UserSchema,
      args: { user_id: { type: typeof GraphQLString } },
      resolve: (_: any, args: any, context: TContext) => Promise<any>
} & GraphQLFieldConfig<any, TContext> = {
      type: UserSchema,
      args: { user_id: { type: GraphQLString } },
      resolve: async (_, args, context: TContext): Promise<any> => {
            const user: UserType = (await context.em.fork().findOne(User, { user_id: args?.user_id }))!;
            return user!;
      }
};

const UserByToken: {
      type: typeof UserSchema,
      resolve: (_: any, args: any, context: TContext) => Promise<any>
} & GraphQLFieldConfig<any, TContext> = {
      type: UserSchema,
      resolve: async (_, args, context: TContext): Promise<any> => {
            const _token = context.request.headers.authorization?.split(" ")[1] || ""
            const user_id = tokenVerify(_token)
            const user: UserType = (await context.em.fork().findOne(User, { user_id }))!;
            return user!;
      }
}

export { Users, UserById , UserByToken };