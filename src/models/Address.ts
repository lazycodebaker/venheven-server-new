import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./User";
import { AddressType } from "../types/User";
import { v4 } from "uuid";
import { TContext } from "../types/Context";


@Entity({ tableName: "addresses" })
export class Address implements AddressType {

      @PrimaryKey({
            name: "address_id",
            type: "uuid",
            comment: "The address id",
      })
      address_id!: string;

      @Property({
            name: "user_id",
            type: "uuid",
            comment: "The user id",
      })
      user_id!: string;

      @OneToOne(() => User, user => user.address)
      user!: User;

      @Property({
            name: "address_line_1",
            type: "string",
            comment: "The address line 1",
      })
      address_line_1!: string;

      @Property({
            name: "city",
            type: "string",
            comment: "The address city",
      })
      city!: string;

      @Property({
            name: "state",
            type: "string",
            comment: "The address state",
      })
      state!: string;

      @Property({
            name: "country",
            type: "string",
            comment: "The address country",
      })
      country!: string;

      @Property({
            name: "pincode",
            type: "string",
            comment: "The address pincode",
      })
      pincode!: string;


      constructor(address: Omit<AddressType, "address_id">) {
            this.address_id = v4();
            this.user_id = address.user_id;
            this.address_line_1 = address.address_line_1;
            this.city = address.city;
            this.state = address.state;
            this.country = address.country;
            this.pincode = address.pincode;
      };

      async saveAddress(context: TContext): Promise<void> {
            await context.em.persistAndFlush(this);
      };
}