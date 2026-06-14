enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'برای انجام',
  [TaskStatus.IN_PROGRESS]: 'درحال انجام',
  [TaskStatus.REVIEW]: 'برای بررسی',
  [TaskStatus.DONE]: 'انجام شده',
};

export { TaskStatus, TaskStatusLabels };
