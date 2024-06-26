
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

import { ProductType } from "../types/Product";
import { v4 } from "uuid";

@Entity({ tableName: "products" })
export class Product implements ProductType {
    @PrimaryKey({
        name: "product_id",
        type: "uuid",
        comment: "The product id",
    })
    product_id!: string;

    @Property({
        name: "name",
        type: "string",
        comment: "The product name",
    })
    name!: string;

    @Property({
        name: "category",
        type: "string",
        comment: "The product category",
    })
    category!: string;

    @Property({
        name: "description",
        type: "string",
        comment: "The product description",
    })
    description!: string;

    @Property({
        name: "price",
        type: "number",
        comment: "The product price",
    })
    price!: number;

    @Property({
        name: "images",
        type: "array",
        comment: "The product images",
    })
    images!: string[];

    @Property({
        name: "videos",
        type: "array",
        comment: "The product videos",
    })
    videos!: string[];

    @Property({
        name: "ratings",
        type: "object",
        comment: "The product ratings",
    })
    ratings!: {
        average: number;
        count: number;
    };

    @Property({
        name: "reviews",
        type: "array",
        comment: "The product reviews",
    })
    reviews!: {
        user_id: string;
        text: string;
        rating: number;
        date: string;
    }[];

    @Property({
        name: "attributes",
        type: "object",
        comment: "The product attributes",
    })
    attributes!: {
        sizes: string[];
        colors: string[];
        materials: string[];
    };

    @Property({
        name: "tags",
        type: "array",
        comment: "The product tags",
    })
    tags!: string[];

    @Property({
        name: "created_at",
        type: "datetime",
        nullable: true,
        default: Date.now(),
        onUpdate: () => new Date(),
    })
    createdAt!: Date;

    @Property({
        name: "updated_at",
        type: "datetime",
        nullable: true,
        default: Date.now(),
        onUpdate: () => new Date(),
    })
    updatedAt!: Date;

    constructor(product: Omit<ProductType, "product_id" | "images" | "videos" | "ratings" | "reviews" | "createdAt" | "updatedAt">) {
        this.product_id = v4();
        this.name = product.name;
        this.category = product.category;
        this.description = product.description;
        this.price = product.price;

        // image set 
        // videos set 
        this.ratings = { average: 0, count: 0 } as ProductType['ratings'];
        this.reviews = [] as ProductType['reviews'];
        this.attributes = product.attributes;
        this.tags = product.tags;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    };

    async setImages(): Promise<void> {

    };

    async setVideos(): Promise<void> {

    };
}


// CART -- PRODDUCT -- ONE - MANY 
// USER -- CART ONE - ONE 