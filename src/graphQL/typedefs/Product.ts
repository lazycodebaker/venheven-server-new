import { GraphQLFieldConfigMap, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLOutputType, GraphQLString } from "graphql"
import { TContext } from "../../types/Context"
import { ProductType } from "../../types/Product";
import { GraphQLUUID } from "graphql-scalars";

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        parents: { type: new GraphQLList(PersonType) },
        children: { type: new GraphQLList(PersonType) },
    })
})
})

export type Fields<T> = {
    [P in keyof T]: {
        type: GraphQLOutputType,
        description: string,
        resolve?: (source: any, args: any, context: TContext, info: any) => any
    }
};

export const ProductSchema: GraphQLObjectType<ProductType, TContext> = new GraphQLInputObjectType({
    name: "Product",
    description: "Product Model Schema For GraphQL",
    fields: (): Fields<ProductType> & GraphQLFieldConfigMap<ProductType, TContext> => ({
        product_id: { type: GraphQLUUID, description: 'Product ID' },
        name: { type: GraphQLString, description: "Product Name" },
        tags: { type: new GraphQLList<ProductType['tags']>() },
    })
});