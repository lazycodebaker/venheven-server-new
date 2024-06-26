

// Third-party imports
import {
      GraphQLBoolean,
      GraphQLFieldConfigMap,
      GraphQLObjectType,
      GraphQLOutputType,
      GraphQLString
} from 'graphql';

// Custom imports 
import { TContext } from '../../types/Context';
import { GraphQLEmailAddress, GraphQLUUID } from 'graphql-scalars';
import { UserType } from '../../types/User';
import { AddressSchema } from './Address';
import { Address } from '../../models/Address';

export type Fields<T> = {
      [P in keyof T]: {
            type: GraphQLOutputType,
            description: string,
            resolve?: (source: any, args: any, context: TContext, info: any) => any
      }
}

export const UserSchema: GraphQLObjectType<UserType, TContext> = new GraphQLObjectType({
      name: 'User',
      description: 'User Model Schema For GraphQL',
      fields: (): Fields<UserType> & GraphQLFieldConfigMap<UserType, TContext> => ({
            user_id: { type: GraphQLUUID, description: 'User ID' },
            username: { type: GraphQLString, description: 'User Username' },
            email: { type: GraphQLEmailAddress, description: 'User Email' },
            firstname: { type: GraphQLString, description: 'User First Name' },
            lastname: { type: GraphQLString, description: 'User Last Name' },
            password: { type: GraphQLString, description: 'User Password' },
            phoneNumber: { type: GraphQLString, description: 'User Phone Number' },
            isVerified: { type: GraphQLBoolean, description: 'User is Verified or not' },
            isLoggedin: { type: GraphQLBoolean, description: 'User is Logged in or not' },
            salt: { type: GraphQLString, description: 'User Salt for crypto hashing' },
            otp: { type: GraphQLString, description: 'User OTP' },
            dateOfBirth: { type: GraphQLString, description: 'User Date of Birth' },
            address: {
                  type: AddressSchema,
                  description: 'User Address',
                  resolve: async (source: any, args: any, context: TContext, info: any) => {
                        const { user_id } = source;
                        const address = await context.em.getRepository(Address).findOne({ user_id });
                        return address;
                  }
            },
            createdAt: { type: GraphQLString, description: 'User Created At' },
            updatedAt: { type: GraphQLString, description: 'User Updated At' },
      })
})
