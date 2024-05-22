// Third-party imports
import { 
    GraphQLFieldConfigMap,
    GraphQLObjectType,
    GraphQLOutputType, 
    GraphQLString,
} from 'graphql';

// Custom imports 
import { TContext } from '../../types/Context';
import { AddressType } from '../../types/User';
import { GraphQLUUID } from 'graphql-scalars';

export type Fields<T> = {
    [P in keyof T]: {
        type: GraphQLOutputType,
        description: string,
        resolve?: (source: any, args: any, context: TContext, info: any) => any
    }
}

export const AddressSchema: GraphQLObjectType<AddressType, TContext> = new GraphQLObjectType({
    name: 'Address',
    description: 'Address Model Type',
    fields: (): Fields<AddressType> & GraphQLFieldConfigMap<AddressType, TContext> => ({
        address_id: { type: GraphQLUUID, description: 'Address ID' },
        user_id: { type: GraphQLString, description: 'User ID' },
        address_line_1: { type: GraphQLString, description: 'Address Line 1' },
        city: { type: GraphQLString, description: 'City' },
        state: { type: GraphQLString, description: 'State' },
        country: { type: GraphQLString, description: 'Country' },
        pincode: { type: GraphQLString, description: 'Pincode' },
    })
});