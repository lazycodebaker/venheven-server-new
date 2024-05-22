import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { InventoryItemsType } from "../types/Inventory";
import { Inventory } from "./Inventory";

@Entity({ tableName: "inventory_items" })
export class InventoryItems implements InventoryItemsType {
    @PrimaryKey({
        name: "inventory_item_id",
        type: "uuid",
        comment: "The inventory item id"
    })
    inventory_item_id!: string;

    @Property({
        name: "product_id",
        type: "uuid",
        comment: "The product id"
    })
    product_id!: string;

    @Property({
        name: "attributes",
        type: "object",
        comment: "The product attributes",
    })
    attributes!: {
        availableSizes: string[];
        availableColors: string[];
    };

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
    updateddAt!: Date;

    @ManyToOne(() => Inventory)
    inventory!: Inventory;

    constructor(inventoryItem: InventoryItemsType) {
        Object.assign(this, inventoryItem);
    };
};