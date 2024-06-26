
// Third-Party Imports 
import { GraphQLArgumentConfig, GraphQLFieldConfig, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDate, GraphQLEmailAddress, GraphQLPhoneNumber } from "graphql-scalars";
import type { ObjMap } from 'graphql/jsutils/ObjMap';


// Custom imports 
import { MessageSchema } from "../typedefs/Message";
import { IMessage } from "../../types/Message";
import logger from "../../logger/Logging";
import { ProductType } from "../../types/Product";
import { TContext } from "../../types/Context";

type TCreateProductArgs = Omit<ProductType, "product_id" | "images" | "videos" | "ratings" | "reviews" | "createdAt" | "updatedAt">;

export const CreateProduct: GraphQLFieldConfig<ProductType, TContext, TCreateProductArgs> = {
    type: MessageSchema,
    args: <ObjMap<GraphQLArgumentConfig>>({
        /*
          name: { type : string};
        category: string;
        description: string;
        price: number;
        attributes: {
            sizes: string[];
            colors: string[];
            materials: string[];
        };
        tags: string[];
        */
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLInt }, 
    }),
    resolve: async (_: any, args: TCreateProductArgs, context: TContext): Promise<IMessage> => {

    }
};