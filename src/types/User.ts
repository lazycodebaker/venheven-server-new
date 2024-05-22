

import { z } from 'zod';

export const userSessionSchema = z.object({
      user_id: z.string(),
      session_id: z.string(),
      login_time: z.date(),
      duration: z.number(),
      device_info: z.object({
            device_type: z.string(),
            browser: z.string(),
            operating_system: z.string(),
            resolution: z.object({
                  width: z.number(),
                  height: z.number(),
            }),
            network_info: z.object({
                  connection_type: z.string(),
                  carrier: z.string(),
                  ip_address: z.string(),
            }),
      })
});

export const addressSchema = z.object({
      address_id: z.string(),
      user_id: z.string(),
      address_line_1: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      pincode: z.string(),
});

export const userSchema = z.object({
      user_id: z.string(),
      username: z.string(),
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      password: z.string(),
      address: addressSchema,
      phoneNumber: z.string().min(8).max(15),
      isVerified: z.boolean().default(false),
      isLoggedin: z.boolean().default(false),
      salt: z.string(),
      otp: z.string().optional(),
      dateOfBirth: z.date().optional(),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
});

export type UserType = z.infer<typeof userSchema>;
export type UserSessionType = z.infer<typeof userSessionSchema>;
export type AddressType = z.infer<typeof addressSchema>;

// const usersWithAddresses = await em.find(User, {}, ['address']);