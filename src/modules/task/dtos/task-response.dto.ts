import { HttpStatus } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { TaskStatus } from '@/shared/constants/task-status';
import ToStorageUrl from '@/shared/decorators/storage-url.decorator';
import BaseResponseDto from '@/shared/dtos/response.dto';
import { createBaseResponse, createDataResponse, createErrorResponse, createPaginatedResponse } from '@/shared/utils/create-response-dto';

import TaskMessage from '../task.message';

class UserData extends PickType(BaseResponseDto, ['id', 'createdAt']) {
  @Expose()
  @ApiProperty({ name: 'first_name', nullable: true })
  firstName: string;

  @Expose()
  @ApiProperty({ name: 'last_name', nullable: true })
  lastName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty({ nullable: true })
  @ToStorageUrl()
  avatar: string;
}

class TaskData extends BaseResponseDto {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string;

  @Expose()
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @Expose()
  @ApiProperty({ name: 'due_date', format: 'date-time', nullable: true })
  dueDate: Date;

  @Expose()
  @ApiProperty({ type: () => UserData, nullable: true })
  assignee: UserData;
}

class TaskStatusData {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty({ enum: TaskStatus })
  value: TaskStatus;
}

class GetTasksResponseDto extends createPaginatedResponse(TaskData, TaskMessage.TASKS_GET) {}
class GetTaskResponseDto extends createDataResponse(TaskData, TaskMessage.TASK_GET) {}
class CreateTaskResponseDto extends createBaseResponse(TaskMessage.TASK_CREATED, HttpStatus.CREATED) {}
class UpdateTaskResponseDto extends createBaseResponse(TaskMessage.TASK_UPDATED) {}
class DeleteTaskResponseDto extends createBaseResponse(TaskMessage.TASK_DELETED) {}

class GetTaskStatusResponseDto extends createDataResponse(TaskStatusData, TaskMessage.STATUSES_GET, HttpStatus.OK, true) {}

class NotFoundTaskResponseDto extends createErrorResponse(TaskMessage.TASK_NOT_FOUND, HttpStatus.NOT_FOUND) {}
class NotFoundProjectResponseDto extends createErrorResponse(TaskMessage.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND) {}

export {
  GetTasksResponseDto,
  GetTaskResponseDto,
  CreateTaskResponseDto,
  UpdateTaskResponseDto,
  DeleteTaskResponseDto,
  GetTaskStatusResponseDto,
  NotFoundTaskResponseDto,
  NotFoundProjectResponseDto,
};
