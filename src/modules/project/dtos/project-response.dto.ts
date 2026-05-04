import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import ProjectMessage from '../project.message';

class WorkspaceData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  logo: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string;
}

class ProjectData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string;

  @Expose()
  @ApiProperty({ name: 'is_archived' })
  isArchived: boolean;

  @Expose()
  @ApiProperty({ name: 'start_date', nullable: true })
  startDate: string;

  @Expose()
  @ApiProperty({ name: 'end_date', nullable: true })
  endDate: string;

  @Expose()
  @ApiProperty({ type: WorkspaceData })
  workspace: WorkspaceData;
}

class GetProjectsResponseDto extends createPaginatedResponse(ProjectData, ProjectMessage.PROJECTS_GET) {}
class GetProjectResponseDto extends createDataResponse(ProjectData, ProjectMessage.PROJECT_GET) {}
class CreateProjectResponseDto extends createBaseResponse(ProjectMessage.PROJECT_CREATED, HttpStatus.CREATED) {}
class UpdaterProjectResponseDto extends createBaseResponse(ProjectMessage.PROJECT_UPDATED) {}
class DeleteProjectResponseDto extends createBaseResponse(ProjectMessage.PROJECT_DELETED) {}

export { GetProjectsResponseDto, GetProjectResponseDto, CreateProjectResponseDto, UpdaterProjectResponseDto, DeleteProjectResponseDto };
