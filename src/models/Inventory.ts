import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { InventoryType } from "../types/Inventory";
import { InventoryItems } from "./InventoryItem";

@Entity({ tableName: "inventory" })
export class Inventory implements InventoryType {

    @PrimaryKey({
        name: "inventory_id",
        type: "uuid",
        comment: "The inventory id"
    })
    inventory_id!: string;

    @OneToMany(() => InventoryItems, inventorySchema => inventorySchema.inventory)
    items!: InventoryItems[]

    @Property({
        name: "created_at",
        type: "datetime",
        nullable: true,
        comment: "The cart created at"
    })
    createdAt!: Date

    @Property({
        name: "updated_at",
        type: "datetime",
        nullable: true,
        comment: "The cart updated at"
    })
    updateddAt!: Date

    constructor(inventory: InventoryType) {
        Object.assign(this, inventory);
    };
};
