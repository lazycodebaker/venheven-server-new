import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { CartItemsType } from "../types/Cart"; 
import { Cart } from "./Cart";

@Entity({ tableName: "cart_items" })
export class CartItem implements CartItemsType {
    @PrimaryKey({
        name: "cart_item_id",
        type: "uuid",
        comment: "The cart item id"
    })
    cart_item_id!: string

    @Property({
        name: "product_id",
        type: "uuid",
        comment: "The product id"
    })
    product_id!: string

    @Property({
        name: "quantity",
        type: "number",
        comment: "The product quantity"
    })
    quantity!: number

    @ManyToOne(() => Cart)
    cart!: Cart;

    constructor(cartItem: CartItemsType) {
        Object.assign(this, cartItem);
    }
}
