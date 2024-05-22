import { Entity, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { CartType } from "../types/Cart";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity({ tableName: "cart" })
export class Cart implements CartType {
    @PrimaryKey({
        name: "cart_id",
        type: "uuid",
        comment: "The cart id"
    })
    cart_id!: string

    @Property({
        name: "user_id",
        type: "uuid",
        comment: "Cart user ( owner ) id"
    })
    user_id!: string

    @OneToOne(() => User, user => user.cart, { owner: true, orphanRemoval: true })
    user!: User;

    @OneToMany(() => CartItem, cartItems => cartItems.cart)
    items!: CartItem[]

    @Property({
        name: "created_at",
        type: "datetime",
        nullable: true,
        comment: "The cart created at"
    })
    created_at!: Date

    @Property({
        name: "updated_at",
        type: "datetime",
        nullable: true,
        comment: "The cart updated at"
    })
    updated_at!: Date

    constructor(cart: CartType) {
        Object.assign(this, cart);
    }
};

// const cartWithItems = await em.findOne(Cart, { user_id: userId }, ['items']);
