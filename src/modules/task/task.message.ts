const TaskMessage = {
  TASKS_GET: 'وظایف با موفقیت دریافت شدند.',
  TASK_GET: 'وظیفه با موفقیت دریافت شد.',
  TASK_CREATED: 'وظیفه ایجاد شد.',
  TASK_UPDATED: 'وظیفه بروزرسانی شد.',
  TASK_DELETED: 'وظیفه حذف شد.',

  STATUSES_GET: 'لیست وضعیت‌های وظیفه دریافت شدند.',

  INVALID_ASSIGNEE: 'کاربر عضو این میزکار نمی‌باشد.',
  TASK_NOT_FOUND: 'وظیفه یافت نشد.',
  PROJECT_NOT_FOUND: 'پروژه یافت نشد.',
} as const;

export default TaskMessage;
