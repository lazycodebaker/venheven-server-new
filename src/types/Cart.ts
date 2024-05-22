
import { z } from "zod";

export const cartItemsSchema = z.object({
    cart_item_id: z.string(),
    product_id: z.string(),
    quantity: z.number(),
});

export const cartSchema = z.object({
    cart_id: z.string(),
    user_id: z.string(),
    items: z.array(
        cartItemsSchema
    ),
    created_at: z.date(),
    updated_at: z.date(),
});

export type CartType = z.infer<typeof cartSchema>; 
export type CartItemsType = z.infer<typeof cartItemsSchema>;