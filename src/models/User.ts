
import { Cascade, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"

import { AddressType, UserSessionType, UserType } from "../types/User";
import { TContext } from "../types/Context";
import otpGenerate from "../utils/otpGenerate";
import generateToken from "../utils/generateToken";
import { hashGenerate } from "../utils/hashGenerate";
import { MailTemplate, sendMail } from "../services/Mail/mailSend";
import { verifyPassword } from "../utils/verifyPassword";
import { Address } from "./Address";
import { Session } from "./Session";
import { CartType } from "../types/Cart";
import { Cart } from "./Cart";
import { v4 } from "uuid";

@Entity({ tableName: "users" })
export class User implements UserType {
      @PrimaryKey({
            name: "user_id",
            type: "uuid",
            comment: "The user id",
      })
      user_id!: string;

      @Property({
            name: "username",
            type: "string",
            comment: "The user username",
      })
      username!: string;

      @Property({
            name: "firstname",
            type: "string",
            comment: "The user firstname",
      })
      firstname!: string;

      @Property({
            name: "lastname",
            type: "string",
            comment: "The user lastname",
      })
      lastname!: string;

      @Property({
            name: "email",
            type: "string",
            comment: "The user email",
      })
      email!: string;

      @Property({
            name: "password",
            type: "string",
            comment: "The user password",
      })
      password!: string;

      @Property({
            name: "phoneNumber",
            type: "string",
            comment: "The user phoneNumber",
      })
      phoneNumber!: string;

      @Property({
            name: "isVerified",
            type: "boolean",
            comment: "The user is Verified from otp or not",
            default: false
      })
      isVerified!: boolean;

      @Property({
            name: "isLoggedin",
            type: "boolean",
            comment: "The user is Logged in or not",
            default: false
      })
      isLoggedin!: boolean;

      @Property({
            name: "salt",
            type: "string",
            comment: "The user salt for crypto hashing",
      })
      salt!: string;

      @Property({
            name: "otp",
            type: "string",
            comment: "The user otp",
      })
      otp!: string;

      @Property({
            name: "date of birth",
            type: "datetime",
            comment: "The user date of birth",
            nullable: true,
      })
      dateOfBirth!: Date;

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

      @OneToOne(() => Address, { cascade: [Cascade.ALL] }, {
            nullable: true
      })
      address!: Address;

      @OneToOne(() => Cart, { cascade: [Cascade.ALL] }, {
            nullable: true
      })
      cart!: Cart;

      @OneToOne(() => Session, { cascade: [Cascade.ALL] }, {
            nullable: true
      })
      session!: UserSessionType;

      constructor(user: Omit<UserType, "user_id" | "otp" | "isVerified" | "isLoggedin" | "salt" | "createdAt" | "updatedAt">) {
            this.user_id = v4();
            this.firstname = user.firstname;
            this.lastname = user.lastname;
            this.email = user.email;
            this.username = user.username;
            this.phoneNumber = user.phoneNumber;
            this.dateOfBirth = user.dateOfBirth!;
            this.setPassword(user.password);
            this.isLoggedin = false;
            this.isVerified = false;
            this.createdAt = new Date();
            this.updatedAt = new Date();
      };

      async setPassword(password: string): Promise<void> {
            const { hash, salt } = await hashGenerate(password);
            this.password = hash;
            this.salt = salt;
            // send the otp now 
            const otpGenerated = await otpGenerate();
            this.otp = otpGenerated;
      };

      async updatePassword(password: string): Promise<void> {
            const { hash, salt } = await hashGenerate(password);
            this.password = hash;
            this.salt = salt;
            this.sendMail("PASSWORDCHANGED");
      };

      async verifyPassword(password: string): Promise<boolean> {
            const passwordVerified = await verifyPassword({
                  password: password,
                  user: this
            });
            return passwordVerified;
      };

      async isUserVerified(): Promise<boolean> {
            return this.isVerified;
      };

      async isUserLoggedin(): Promise<boolean> {
            return this.isLoggedin;
      };

      async loginUser(): Promise<UserType> {
            this.isLoggedin = true
            return this
      };

      async logoutUser(): Promise<UserType> {
            this.isLoggedin = false
            return this
      };

      async verifyUser(): Promise<UserType> {
            this.isVerified = true
            return this
      }

      async saveUser(context: TContext): Promise<void> {
            await await context.em.persistAndFlush(this);
      };

      async getToken(): Promise<string> {
            const token = await generateToken(this.user_id);
            return token;
      };

      async setAddress(address: AddressType): Promise<void> {
            this.address = new Address(address);
      };

      async sendMail(mailType: MailTemplate): Promise<void> {
            await sendMail({
                  mailType: mailType,
                  to: this.email,
                  username: this.firstname + " " + this.lastname,
                  otp: this.otp
            });
      };
};