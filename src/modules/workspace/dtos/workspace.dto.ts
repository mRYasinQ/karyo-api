import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { WorkspaceRole } from '@/shared/constants/workspace-role';
import baseQuerySchema from '@/shared/schemas/base-query.schema';
import booleanStringSchema from '@/shared/schemas/boolean-string.schema';
import fileSchema from '@/shared/schemas/file.schema';
import slugSchema from '@/shared/schemas/slug.schema';
import { emailSchema } from '@/shared/schemas/user.schema';

const baseWorkspaceSchema = z.object({
  name: z
    .string('نام میزکار باید رشته باشد.')
    .min(2, 'نام میزکار باید حداقل ۲ کاراکتر باشد.')
    .max(50, 'نام میزکار می‌تواند حداکثر ۵۰ کاراکتر باشد.'),
  slug: slugSchema,
  logo: fileSchema.nullable().optional(),
  description: z.string('توضیحات باید رشته باشد.').max(200, 'توضیحات می‌تواند حداکثر ۲۰۰ کاراکتر باشد.').nullable().optional(),
});

const createWorkspaceSchema = baseWorkspaceSchema;
class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}
type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;

const updateWorkspaceSchema = baseWorkspaceSchema.omit({ slug: true }).partial();
class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}
type UpdateWorkspace = z.infer<typeof updateWorkspaceSchema>;

const adminUpdateWorkspaceSchema = baseWorkspaceSchema.partial();
class AdminUpdateWorkspaceDto extends createZodDto(adminUpdateWorkspaceSchema) {}
type AdminUpdateWorkspace = z.infer<typeof adminUpdateWorkspaceSchema>;

const getWorkspacesQuerySchema = baseQuerySchema.extend({
  search: z.string().optional(),
});
class GetWorkspacesQueryDto extends createZodDto(getWorkspacesQuerySchema) {}
type GetWorkspacesQuery = z.infer<typeof getWorkspacesQuerySchema>;

const getInvitationsQuerySchema = baseQuerySchema;
class GetInvitationsQueryDto extends createZodDto(getInvitationsQuerySchema) {}
type GetInvitationsQuery = z.infer<typeof getInvitationsQuerySchema>;

const inviteMemberSchema = z.object({
  email: emailSchema,
});
class InviteMemberDto extends createZodDto(inviteMemberSchema) {}
type InviteMember = z.infer<typeof inviteMemberSchema>;

const inviteMemberRespondSchema = z.object({
  accept: booleanStringSchema('وضعیت پذیرش دعوتنامه باید بولین باشد.'),
});
class InviteMemberRespondDto extends createZodDto(inviteMemberRespondSchema) {}
type InviteMemberRespond = z.infer<typeof inviteMemberRespondSchema>;

const getMembersWorkspaceQuerySchema = baseQuerySchema.extend({
  search: z.string().optional(),
  is_active: booleanStringSchema().default(true),
  role: z.enum(WorkspaceRole).optional(),
});
class GetMembersWorkspaceQueryDto extends createZodDto(getMembersWorkspaceQuerySchema) {}
type GetMembersWorkspaceQuery = z.infer<typeof getMembersWorkspaceQuerySchema>;

const updateRoleMemberSchema = z.object({
  role: z
    .enum(WorkspaceRole, 'نقش وارد شده معتبر نیست.')
    .refine((value) => value !== WorkspaceRole.OWNER, 'تغییر نقش به مالک از این طریق امکان پذیر نمی‌باشد.'),
});
class UpdateRoleMemberDto extends createZodDto(updateRoleMemberSchema) {}
type UpdateRoleMember = z.infer<typeof updateRoleMemberSchema>;

export type {
  CreateWorkspace,
  UpdateWorkspace,
  AdminUpdateWorkspace,
  GetWorkspacesQuery,
  GetInvitationsQuery,
  InviteMember,
  InviteMemberRespond,
  GetMembersWorkspaceQuery,
  UpdateRoleMember,
};
export {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AdminUpdateWorkspaceDto,
  GetWorkspacesQueryDto,
  GetInvitationsQueryDto,
  InviteMemberDto,
  InviteMemberRespondDto,
  GetMembersWorkspaceQueryDto,
  UpdateRoleMemberDto,
};
