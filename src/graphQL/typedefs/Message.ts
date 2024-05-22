
// Third-party imports
import {
      GraphQLBoolean,
      GraphQLObjectType,
      GraphQLOutputType,
      GraphQLResolveInfo,
      GraphQLString,
      GraphQLFieldConfigMap
} from 'graphql';

// Custom imports
import { UserSchema } from './User';
import { IMessage } from '../../types/Message';
import { AddressSchema } from './Address';

export type Fields<T> = {
      [P in keyof T]: {
            type: GraphQLOutputType,
            description: string,
      }
}

export const MessageSchema: GraphQLObjectType<IMessage, GraphQLResolveInfo> = new GraphQLObjectType({
      name: "Message",
      description: "Message Model Type",
      fields: ():Fields<IMessage> & GraphQLFieldConfigMap<IMessage,GraphQLResolveInfo> => ({
            success: { type: GraphQLBoolean ,description: 'Status for the request' },
            message: { type: GraphQLString ,description: 'Message' },
            extras: { type: UserSchema || AddressSchema  ,description: 'Extras Object' },
            token: { type: GraphQLString ,description: 'Token for user to be added to localstorage to the client' },
            errorType: { type: GraphQLString ,description: 'Error Type' },
      }),
});