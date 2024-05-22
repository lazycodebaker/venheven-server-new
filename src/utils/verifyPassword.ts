
// Third-party imports
import crypto from 'crypto';

// Custom imports
import { UserType } from '../types/User';
import logger from '../logger/Logging';

type verifyPasswordArgs = {
      user: any,
      password: string
}

export const verifyPassword = async ({ user, password }: verifyPasswordArgs) => {
      const hash = crypto.pbkdf2Sync(password, user?.salt, 1000, 64, 'sha512').toString('hex');
      logger.info(`Password verification for ${user?.email} , hash generated`)
      return hash === user?.password;
}