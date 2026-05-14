import SessionEntity from '@/modules/session/session.entity';
import { WorkspaceRole } from '@/modules/workspace/constants/workspace-role.constant';

import type { Permission } from '../constants/permission';
import type { EnvConfig } from '../schemas/env.schema';

type Session = Omit<SessionEntity, 'user'>;
type ActiveWorkspace = { id: number; slug: string; role: WorkspaceRole; isActive: boolean };

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvConfig {}
  }

  namespace Express {
    interface Request {
      userId?: number;
      currentSession?: Session;
      userPermissions: Permission[];
      activeWorkspace?: ActiveWorkspace;
      uploadedFileKey?: string | string[];
    }
  }
}

export type { Session, ActiveWorkspace };
