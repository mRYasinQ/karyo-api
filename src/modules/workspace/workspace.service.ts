import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager, type FilterQuery, wrap } from '@mikro-orm/postgresql';

import CommonMessage from '@/shared/constants/common-message';
import { WorkspaceRole } from '@/shared/constants/workspace-role';
import { getPaginationOptions, paginate } from '@/shared/utils/pagination';

import type { FindOneMethod } from '@/shared/types/service';

import MailService from '../mail/providers/mail.service';
import StorageProducer from '../storage/providers/storage.producer';
import UserEntity from '../user/user.entity';
import UserService from '../user/user.service';
import type { AdminUpdateWorkspace, CreateWorkspace, GetInvitationsQuery, InviteMember, InviteMemberRespond } from './dtos/workspace.dto';
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
    private readonly workspaceRep: WorkspaceRepository,
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly storageProducer: StorageProducer,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  findOne: FindOneMethod<WorkspaceEntity, FilterQuery<WorkspaceEntity>> = (filter, options?) => {
    return this.workspaceRep.findOne(filter, options);
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

  async getInvitations(userId: number, query: GetInvitationsQuery) {
    const { page, ...findOptions } = getPaginationOptions({ query, defaultSort: 'joinedAt' });

    const [data, total] = await this.memberRepo.findAndCount(
      { user: { id: userId }, isActive: false },
      { ...findOptions, populate: ['workspace'], exclude: ['workspace.members', 'user', 'isActive', 'role'] },
    );

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
}

export default WorkspaceService;
