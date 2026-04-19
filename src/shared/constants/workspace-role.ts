enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

const WorkspaceRoleLabels: Record<WorkspaceRole, string> = {
  [WorkspaceRole.OWNER]: 'مالک',
  [WorkspaceRole.ADMIN]: 'مدیر',
  [WorkspaceRole.MEMBER]: 'عضو',
  [WorkspaceRole.GUEST]: 'مهمان',
};

export { WorkspaceRole, WorkspaceRoleLabels };
