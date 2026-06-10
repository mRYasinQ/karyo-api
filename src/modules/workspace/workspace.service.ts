import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, type FilterQuery, LoadStrategy, wrap } from '@mikro-orm/postgresql';

import CommonMessage from '@/shared/constants/common-message';
import { WorkspaceRole } from '@/shared/constants/workspace-role';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import MailService from '../mail/providers/mail.service';
import StorageProducer from '../storage/providers/storage.producer';
import UserEntity from '../user/user.entity';
import UserService from '../user/user.service';
import type {
  AdminUpdateWorkspace,
  CreateWorkspace,
  GetInvitationsQuery,
  GetMembersWorkspaceQuery,
  GetWorkspacesQuery,
  InviteMember,
  InviteMemberRespond,
  UpdateRoleMember,
} from './dtos/workspace.dto';
import WorkspaceMemberEntity from './entities/member.entity';
import WorkspaceEntity from './entities/workspace.entity';
import type { FindMemberOfWorkspaceFilter } from './interfaces/workspace.interface';
import WorkspaceMemberRepository from './repositories/member.repository';
import WorkspaceRepository from './repositories/workspace.repository';
import WorkspaceMessage from './workspace.message';

@Injectable()
class WorkspaceService {
  constructor(
    private readonly em: EntityManager,
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly storageProducer: StorageProducer,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  findOne: FindOneMethod<WorkspaceEntity, FilterQuery<WorkspaceEntity>> = (filter, options?) => {
    return this.workspaceRepo.findOne(filter, options);
  };

  findMemberOfWorkspace: FindOneMethod<WorkspaceMemberEntity, FindMemberOfWorkspaceFilter> = (filter, options?) => {
    const { memberId, identity } = filter;

    const where: FilterQuery<WorkspaceMemberEntity> = {
      user: { id: memberId },
    };

    if (typeof identity === 'number') {
      where.workspace = { id: identity };
    } else {
      where.workspace = { slug: identity };
    }

    return this.memberRepo.findOne(where, options);
  };

  async getActiveWorkspaces(userId: number, query: GetWorkspacesQuery) {
    const { search, ...paginationQuery } = query;
    const { page, ...findOptions } = getPaginationOptions({ query: paginationQuery });

    const where: FilterQuery<WorkspaceEntity> = {
      members: { user: userId, isActive: true },
    };

    if (search) where.name = { $ilike: `%${search}%` };

    const [workspaces, total] = await this.workspaceRepo.findAndCount(where, {
      ...findOptions,
      populate: ['members'],
      populateWhere: {
        members: { user: userId, isActive: true },
      },
      strategy: LoadStrategy.JOINED,
    });

    const data = workspaces.map((workspace) => {
      const member = workspace.members[0];
      const workspacePlain = wrap(workspace).toObject();

      return {
        ...workspacePlain,
        role: member?.role,
      };
    });

    return paginate(data, total, page, findOptions.limit);
  }

  async getInvitations(userId: number, query: GetInvitationsQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query });

    const [data, total] = await this.workspaceRepo.findAndCount(
      { members: { user: userId, isActive: false } },
      { ...findOptions, exclude: ['members'], strategy: LoadStrategy.JOINED },
    );

    return paginate(data, total, page, findOptions.limit);
  }

  async getWorkspaceWithRole(slug: string, userId: number) {
    const workspace = await this.workspaceRepo.findOne({ slug, members: { user: userId, isActive: true } }, { exclude: ['members'] });
    if (!workspace) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    const member = await this.memberRepo.findOne({ workspace: workspace.id, user: userId }, { fields: ['role'] });

    const workspacePlain = wrap(workspace).toObject();

    return { ...workspacePlain, role: member?.role };
  }

  async findMembersOfWorkspace(workspaceId: number, query: GetMembersWorkspaceQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query, isOptional: true, defaultSort: 'joinedAt' });
    const where = this.buildWhereClause(workspaceId, query);

    const [data, total] = await this.memberRepo.findAndCount(where, {
      ...findOptions,
      populate: ['user'],
      exclude: [
        'isActive',
        'workspace',
        'user.password',
        'user.isActive',
        'user.isEmailVerified',
        'user.role',
        'user.email',
        'user.updatedAt',
      ],
      strategy: LoadStrategy.JOINED,
    });

    return paginate(data, total, page, findOptions.limit);
  }

  async inviteMember(workspaceId: number, data: InviteMember) {
    const user = await this.userService.findOneByEmail(data.email, { fields: ['id', 'email', 'firstName'] });
    if (!user) return;

    const existingMember = await this.findMemberOfWorkspace({ memberId: user.id, identity: workspaceId }, { fields: ['isActive'] });
    if (existingMember) {
      if (existingMember.isActive) {
        throw new BadRequestException(WorkspaceMessage.ALREADY_MEMBER);
      } else return;
    }

    this.memberRepo.create({
      workspace: this.em.getReference(WorkspaceEntity, workspaceId),
      user: this.em.getReference(UserEntity, user.id),
      role: WorkspaceRole.MEMBER,
    });

    const userFirstName = user.firstName ?? 'کاربر';

    await this.em.flush();

    await this.mailService.sendMail({
      jobName: 'invite_member',
      mail: user.email,
      title: 'دعوتنامه در میزکار جدید',
      message: `${userFirstName} عزیز، دعوتنامه جدیدی برای شما ارسال شده است.`,
    });

    return;
  }

  async respondToInvitation(workspaceId: number, userId: number, data: InviteMemberRespond) {
    const member = await this.findMemberOfWorkspace({ memberId: userId, identity: workspaceId }, { fields: ['isActive'] });
    if (!member) throw new NotFoundException(WorkspaceMessage.INVITE_NOT_FOUND);
    if (member.isActive) throw new BadRequestException(WorkspaceMessage.ALREADY_MEMBER);

    if (data.accept) {
      member.isActive = true;
    } else {
      this.em.remove(member);
    }

    await this.em.flush();

    return;
  }

  async updateMemberRole(workspaceId: number, memberId: number, data: UpdateRoleMember) {
    const member = await this.getValidateWorkspaceMember(workspaceId, memberId);
    if ((member.role as WorkspaceRole) === WorkspaceRole.OWNER) throw new BadRequestException(WorkspaceMessage.OWNER_ROLE_CANNOT_CHANGE);

    member.role = data.role;
    await this.em.flush();

    return;
  }

  async removeMember(workspaceId: number, memberId: number, requestorRole: WorkspaceRole) {
    const member = await this.findMemberOfWorkspace({ memberId: memberId, identity: workspaceId }, { fields: ['isActive', 'role'] });
    if (!member) throw new NotFoundException(WorkspaceMessage.MEMBER_NOT_FOUND);

    const memberRole = member.role as WorkspaceRole;

    if (memberRole === WorkspaceRole.OWNER) {
      throw new BadRequestException(WorkspaceMessage.WORKSPACE_OWNER_CANNOT_LEAVE_OR_REMOVED);
    }

    if (requestorRole === WorkspaceRole.ADMIN && memberRole === WorkspaceRole.ADMIN) {
      throw new BadRequestException(WorkspaceMessage.ADMIN_CANNOT_REMOVE_ADMIN);
    }

    this.em.remove(member);
    await this.em.flush();

    return;
  }

  async leaveMember(workspaceId: number, memberId: number) {
    const member = await this.getValidateWorkspaceMember(workspaceId, memberId);
    if ((member.role as WorkspaceRole) === WorkspaceRole.OWNER) {
      throw new BadRequestException(WorkspaceMessage.WORKSPACE_OWNER_CANNOT_LEAVE_OR_REMOVED);
    }

    this.em.remove(member);
    await this.em.flush();

    return;
  }

  async create(data: CreateWorkspace, userId: number) {
    const isExist = await this.checkWorkspaceExistBySlug(data.slug);
    if (isExist) throw new ConflictException(WorkspaceMessage.SLUG_EXIST);

    return this.em.transactional(async (em) => {
      const workspace = em.create(WorkspaceEntity, data);
      const member = em.create(WorkspaceMemberEntity, {
        workspace,
        user: em.getReference(UserEntity, userId),
        role: WorkspaceRole.OWNER,
        isActive: true,
      });

      em.persist([workspace, member]);
      await em.flush();

      return workspace;
    });
  }

  async update(id: number, data: AdminUpdateWorkspace) {
    const workspace = await this.findOne({ id }, { fields: ['id', 'slug', 'logo'] });
    if (!workspace) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    const workspaceLogo = workspace.logo;

    const { slug, logo } = data;

    if (slug && slug !== workspace.slug) {
      const isExist = await this.checkWorkspaceExistBySlug(slug);
      if (isExist) throw new ConflictException(WorkspaceMessage.SLUG_EXIST);
    }

    wrap(workspace).assign(data);
    await this.em.flush();

    if (workspaceLogo && (logo || logo === null)) await this.storageProducer.deleteFile({ fileKey: workspaceLogo });

    return;
  }

  async delete(id: number) {
    const workspace = await this.findOne({ id }, { fields: ['id', 'logo'] });
    if (!workspace) throw new NotFoundException(CommonMessage.WORKSPACE_NOT_FOUND);

    this.em.remove(workspace);
    await this.em.flush();

    const workspaceLogo = workspace.logo;
    if (workspaceLogo) await this.storageProducer.deleteFile({ fileKey: workspaceLogo });

    return;
  }

  async checkWorkspaceExistBySlug(slug: string) {
    const workspace = await this.findOne({ slug }, { fields: ['id'] });
    return Boolean(workspace);
  }

  private async getValidateWorkspaceMember(workspaceId: number, userId: number) {
    const member = await this.findMemberOfWorkspace({ memberId: userId, identity: workspaceId }, { fields: ['isActive', 'role'] });
    if (!member || (member && !member.isActive)) throw new NotFoundException(WorkspaceMessage.MEMBER_NOT_FOUND);

    return member;
  }

  private buildWhereClause(workspaceId: number, query: GetMembersWorkspaceQuery) {
    const { search, is_active, role } = query;

    const where: FilterQuery<WorkspaceMemberEntity> = {
      workspace: { id: workspaceId },
      isActive: is_active,
    };

    if (search) {
      where.user = {
        $or: [
          { firstName: { $ilike: `%${search}%` } },
          { lastName: { $ilike: `%${search}%` } },
          { email: { $ilike: `%${search}%` } },
          { username: { $ilike: `%${search}%` } },
        ],
      };
    }
    if (role) where.role = role;

    return where;
  }
}

export default WorkspaceService;
