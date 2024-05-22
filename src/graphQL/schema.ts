
// Third-party imports
import { GraphQLObjectType, GraphQLSchema } from "graphql";

// Custom imports
import { Users, UserById, UserByToken } from "./queries/User";
import { CreateUser, LoginUser, LoginUserWitToken, LogoutUser, UpdateUserAddress, UpdateUserPassword, VerifyOtp } from "./mutations/User";

const Queries = new GraphQLObjectType({
      name: 'Queries',
      fields: {
            users: Users,
            userById: UserById,
            userByToken: UserByToken
      },
});

const Mutations = new GraphQLObjectType({
      name: 'Mutations',
      fields: {
            createUser: CreateUser,
            loginUser: LoginUser,
            verifyOtp: VerifyOtp,
            loginWithToken: LoginUserWitToken,
            logoutUser: LogoutUser,
            updateUserAddress: UpdateUserAddress,
            updatePassword: UpdateUserPassword
      }
});

export const schema = new GraphQLSchema({
      query: Queries,
      mutation: Mutations
});