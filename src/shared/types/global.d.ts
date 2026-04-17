import SessionEntity from '@/modules/session/session.entity';

import type { Permission } from '../constants/permission';

type Session = Omit<SessionEntity, 'user'>;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_URL: string;
      APP_PORT: string;
      STORAGE_URL: string;

      REDIS_URL: string;
      REDIS_PASSWORD: string;

      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;

      MAIL_SECURE: string;
      MAIL_FROM: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;

      MINIO_URL: string;
      MINIO_BUCKET: string;
      MINIO_USER: string;
      MINIO_PASSWORD: string;

      OTP_EXPIRE: string;
      OTP_CACHE: string;
      SESSION_EXPIRE: string;
    }
  }

  namespace Express {
    interface Request {
      userId?: number;
      currentSession?: Session;
      userPermissions: Permission[];
      uploadedFileKey?: string | string[];
    }
  }
}

export type { Session };
