
import { z } from "zod";

export const inventoryItemsSchema = z.object({
    inventory_item_id: z.string(),
    product_id: z.string(),
    attributes: z.object({
        availableSizes: z.array(z.string()),
        availableColors: z.array(z.string())
    }),
    createdAt: z.date().default(() => new Date()),
    updateddAt: z.date().default(() => new Date()),
});

export const inventorySchema = z.object({
    inventory_id: z.string(),
    items: z.array(
        inventoryItemsSchema
    ),
    createdAt: z.date().default(() => new Date()),
    updateddAt: z.date().default(() => new Date()),
});

export type InventoryType = z.infer<typeof inventorySchema>;
export type InventoryItemsType = z.infer<typeof inventoryItemsSchema>;