
// Third-Party Imports 
import { GraphQLArgumentConfig, GraphQLFieldConfig, GraphQLString } from "graphql";
import { GraphQLDate, GraphQLEmailAddress, GraphQLPhoneNumber } from "graphql-scalars";

import type { ObjMap } from 'graphql/jsutils/ObjMap';

// Custom Imports
// import { IAddress, any } from "../../types/User";
import { User } from "../../models/User";
import { TContext } from "../../types/Context";
import { IMessage } from "../../types/Message";
import { MessageSchema } from "../typedefs/Message";
import { tokenVerify } from "../../utils/tokenVerify";
import logger from '../../logger/Logging';
import { AddressType, UserType } from '../../types/User';

import { Address } from '../../models/Address';

type TCreateUserArgs = {
      username: string,
      email: string,
      firstname: string,
      lastname: string,
      password: string,
      phoneNumber: string,
      dateOfBirth: Date,
};

type TLoginUserArgs = {
      username: string,
      password: string
};

type TVerifyUserArgs = {
      OTP: string
};

type TAddressArgs = {
      address_line_1: string,
      city: string,
      state: string,
      country: string,
      pincode: string
};

type TPasswordUpdateArgs = {
      currentPassword: string,
      newPassword: string
};

export const CreateUser: GraphQLFieldConfig<UserType, TContext, TCreateUserArgs> = {
      type: MessageSchema,
      args: <ObjMap<GraphQLArgumentConfig>>({
            username: { type: GraphQLString },
            email: { type: GraphQLEmailAddress },
            firstname: { type: GraphQLString },
            lastname: { type: GraphQLString },
            password: { type: GraphQLString },
            phoneNumber: { type: GraphQLPhoneNumber },
            dateOfBirth: { type: GraphQLDate },
      }),
      resolve: async (_: any, args: TCreateUserArgs, context: TContext): Promise<IMessage> => {
            try {
                  const userExists = await context.em.fork().findOne(User, {
                        $or: [
                              { username: args!.username },
                              { email: args!.email }
                        ],
                  });

                  if (userExists) {
                        logger.info(`User Already Exists - ${userExists}`)
                        return {
                              success: false,
                              message: 'User Already Exists',
                              extras: null,
                              errorType: null
                        }
                  };

                  const new_user = await new User({
                        firstname: args!.firstname,
                        lastname: args!.lastname,
                        email: args!.email,
                        phoneNumber: args!.phoneNumber,
                        password: args!.password,
                        username: args!.username,
                        address: {} as AddressType,
                        dateOfBirth: args!.dateOfBirth,
                  });

                  const token = await new_user.getToken();
                  await new_user.saveUser(context);
                  await new_user.sendMail('OTP');

                  logger.info(`User Created - ${new_user.user_id}`);

                  return {
                        success: true,
                        message: 'User Created Successfully',
                        extras: new_user,
                        token: token,
                        errorType: null
                  };

            }
            catch (error) {
                  logger.error(`User Creation Failed - ${error}`)
                  return {
                        success: false,
                        message: 'User Creation Failed',
                        extras: null,
                        errorType: error as string
                  };
            };
      }
};

export const LoginUser: GraphQLFieldConfig<UserType, TContext, TLoginUserArgs> = {
      type: MessageSchema,
      args: <ObjMap<GraphQLArgumentConfig>>({
            username: { type: GraphQLString },
            password: { type: GraphQLString },
      }),
      resolve: async (_: any, args: TLoginUserArgs, context: TContext): Promise<IMessage> => {
            try {
                  const user = await context.em.fork().findOne(User, {
                        $or: [
                              { username: args!.username },
                              { email: args!.username }
                        ],
                  });

                  const token = await user?.getToken();

                  if (!user) {
                        logger.info(`User Not Found - ${args!.username}`)
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  const passwordMatch = await user.verifyPassword(args!.password);

                  if (!passwordMatch) {
                        logger.info(`Password Not Match - ${args!.password}`)
                        return {
                              success: false,
                              message: 'Password Not Match',
                              extras: null,
                              errorType: null
                        };
                  };

                  if (!(await user.isUserVerified())) {
                        logger.info(`User Not Verified - ${user.username}`)
                        return {
                              success: false,
                              message: 'User Not Verified, Please Verify Your Email',
                              extras: user,
                              errorType: null,
                              token: token
                        };
                  };

                  if (await user.isUserLoggedin()) {
                        logger.info(`User Already Logged In - ${user.username}`)
                        return {
                              success: true,
                              message: 'User Already Logged In',
                              extras: user,
                              token: token,
                              errorType: null,
                        };
                  };

                  await user.loginUser();
                  await user.saveUser(context);

                  logger.info(`User Logged In - ${user.username}`);

                  return {
                        success: true,
                        message: 'User Logged In Successfully',
                        extras: user,
                        token: token,
                        errorType: null
                  };
            }
            catch (error) {
                  logger.error(`User Login Failed - ${error}`)
                  return {
                        success: false,
                        message: 'User Login Failed',
                        extras: null,
                        errorType: error as string
                  };
            };
      }
};



export const VerifyOtp: GraphQLFieldConfig<UserType, TContext, TVerifyUserArgs> = {
      type: MessageSchema,
      args: <ObjMap<GraphQLArgumentConfig>>({
            OTP: { type: GraphQLString },
      }),
      resolve: async (_: any, args: TVerifyUserArgs, context: TContext): Promise<IMessage> => {
            try {
                  const _token = context.request.headers.authorization?.split(" ")[1] || "";
                  const user_id = await tokenVerify(_token);

                  if (!user_id) {
                        logger.info(`User Not Found - ${user_id}`);
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  const user = await context.em.fork().findOne(User, { user_id: user_id });

                  if (!user) {
                        logger.info(`User Not Found - ${user_id}`);
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  if (user.otp !== args!.OTP) {
                        logger.info(`OTP Not Match - ${args!.OTP}`)
                        return {
                              success: false,
                              message: 'OTP Not Match',
                              extras: null,
                              errorType: null
                        };
                  };

                  if (user.isVerified) {
                        logger.info(`User Already Verified - ${user.user_id}`)
                        return {
                              success: true,
                              message: 'User Already Verified',
                              extras: user,
                              token: _token,
                              errorType: null
                        };
                  };

                  await user.verifyUser();
                  user.otp = '';
                  await user.saveUser(context);

                  await user.sendMail("WELCOME");
                  logger.info(`User Verified - ${user.user_id}`);

                  return {
                        success: true,
                        message: 'User Verified Successfully',
                        token: _token,
                        extras: user,
                        errorType: null,
                  };
            }
            catch (error) {
                  logger.error(`User Verification Failed - ${error}`)
                  return {
                        success: false,
                        message: 'User Verification Failed',
                        extras: null,
                        errorType: error as string
                  };
            };
      }
};

export const LoginUserWitToken: GraphQLFieldConfig<UserType, TContext> = {
      type: MessageSchema,
      resolve: async (_: any, __: any, context: TContext): Promise<IMessage> => {
            try {
                  const _token = context.request.headers.authorization?.split(" ")[1] || "";
                  const user_id = await tokenVerify(_token);

                  if (!user_id) {
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  const user = await context.em.fork().findOne(User, { user_id: user_id });

                  if (!user) {
                        logger.info(`User Not Found - ${user_id}`)
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  if (!(await user.isUserVerified())) {
                        logger.info(`User Not Verified - ${user.username}`)
                        return {
                              success: false,
                              message: 'User Not Verified',
                              extras: null,
                              errorType: null
                        };
                  };

                  if ((await user.isUserLoggedin())) {
                        logger.info(`User Already Logged In - ${user.username}`)
                        return {
                              success: true,
                              message: 'User Already Logged In',
                              extras: user,
                              errorType: null,
                              token: _token
                        };
                  };

                  await user.loginUser();
                  await user.saveUser(context);

                  logger.info(`User Logged In - ${user.username}`);

                  return {
                        success: true,
                        message: 'User Logged In Successfully',
                        extras: user,
                        token: _token,
                        errorType: null
                  };
            } catch (error) {
                  logger.error(`User Login Failed - ${error}`)
                  return {
                        success: false,
                        message: 'User Login Failed',
                        extras: null,
                        errorType: error as string
                  };
            };
      }
};

export const LogoutUser: GraphQLFieldConfig<UserType, TContext> = {
      type: MessageSchema,
      resolve: async (_: any, __: any, context: TContext): Promise<IMessage> => {
            try {
                  const _token = context.request.headers.authorization?.split(" ")[1] || "";
                  const user_id = await tokenVerify(_token);

                  if (!user_id) {
                        logger.info(`User Not Found - ${user_id}`)
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  const user = await context.em.fork().findOne(User, { user_id: user_id });

                  if (!user) {
                        logger.info(`User Not Found - ${user_id}`)
                        return {
                              success: false,
                              message: 'User Not Found',
                              extras: null,
                              errorType: null
                        };
                  };

                  await user.logoutUser();
                  await user.saveUser(context);

                  logger.info(`User Logged Out - ${user.username}`);

                  return {
                        success: true,
                        message: 'User Logged Out Successfully',
                        extras: user,
                        errorType: null
                  };

            } catch (error) {
                  logger.error(`User Logout Failed - ${error}`)
                  return {
                        success: false,
                        message: 'User Logout Failed',
                        extras: null,
                        errorType: error as string
                  };
            }
      }
};

export const UpdateUserAddress: GraphQLFieldConfig<UserType, TContext, TAddressArgs> = {
      type: MessageSchema,
      args: <ObjMap<GraphQLArgumentConfig>>({
            address_line_1: { type: GraphQLString },
            city: { type: GraphQLString },
            state: { type: GraphQLString },
            country: { type: GraphQLString },
            pincode: { type: GraphQLString }
      }),
      resolve: async (_, args, context: TContext): Promise<IMessage> => {
            const _token = context.request.headers.authorization?.split(" ")[1] || "";
            const user_id = tokenVerify(_token);

            if (!user_id) {
                  logger.info(`Invalid or Expired Token - ${user_id}`)
                  return {
                        success: false,
                        message: 'Invalid or Expired Token',
                        extras: null,
                        errorType: null
                  };
            };

            const user = await context.em.fork().findOne(User, { user_id: user_id });

            if (!user) {
                  logger.info(`User Not Found - ${user_id}`)
                  return {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };
            };

            if (!(await user.isUserVerified())) {
                  logger.info(`User Not Verified - ${user.username}`)
                  return {
                        success: false,
                        message: 'User Not Verified',
                        extras: null,
                        errorType: null
                  };
            };

            if (!(await user.isUserLoggedin())) {
                  logger.info(`User Not Logged In - ${user.username}`)
                  return {
                        success: false,
                        message: 'User Not Logged In',
                        extras: null,
                        errorType: null
                  };
            };

            const address = new Address({
                  user_id: user.user_id,
                  address_line_1: args.address_line_1,
                  city: args.city,
                  state: args.state,
                  country: args.country,
                  pincode: args.pincode
            });

            await address.saveAddress(context);
            await user.setAddress(address);
            await user.saveUser(context);

            return {
                  success: true,
                  message: 'User Address Updated Successfully',
                  extras: address,
                  errorType: null
            };
      }
};

export const UpdateUserPassword: GraphQLFieldConfig<UserType, TContext, TPasswordUpdateArgs> = {
      type: MessageSchema,
      args: <ObjMap<GraphQLArgumentConfig>>({
            currentPassword: { type: GraphQLString },
            newPassword: { type: GraphQLString }
      }),
      resolve: async (_, args, context: TContext): Promise<IMessage> => {
            const _token = context.request.headers.authorization?.split(" ")[1] || "";
            const user_id = tokenVerify(_token);

            if (!user_id) {
                  logger.info(`Invalid or Expired Token - ${user_id}`)
                  return {
                        success: false,
                        message: 'Invalid or Expired Token',
                        extras: null,
                        errorType: null
                  };
            };

            const user = await context.em.fork().findOne(User, { user_id: user_id });

            if (!user) {
                  logger.info(`User Not Found - ${user_id}`)
                  return {
                        success: false,
                        message: 'User Not Found',
                        extras: null,
                        errorType: null
                  };
            };

            if (!(await user.isUserVerified())) {
                  logger.info(`User Not Verified - ${user.username}`)
                  return {
                        success: false,
                        message: 'User Not Verified',
                        extras: null,
                        errorType: null
                  };
            };

            if (!(await user.isUserLoggedin())) {
                  logger.info(`User Not Logged In - ${user.username}`)
                  return {
                        success: false,
                        message: 'User Not Logged In',
                        extras: null,
                        errorType: null
                  };
            };

            const passwordVerified = await user.verifyPassword(args.currentPassword);
            if (!passwordVerified) {
                  logger.info(`Current Password is Incorrect - ${user.username}`)
                  return {
                        success: false,
                        message: 'Current Password is Incorrect',
                        extras: null,
                        errorType: null
                  };
            };

            await user.updatePassword(args.newPassword);
            await user.saveUser(context);

            logger.info(`User Password Updated Successfully - ${user.username}`)

            return {
                  success: true,
                  message: 'Password Updated Successfully',
                  extras: null,
                  errorType: null
            };
      }
};