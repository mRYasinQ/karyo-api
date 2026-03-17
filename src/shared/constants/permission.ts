const PERMISSIONS = [
  {
    name: 'مدیریت کاربران',
    value: 'MANAGE_USERS',
  },
  {
    name: 'مدیریت نقش‌ها',
    value: 'MANAGE_ROLES',
  },
  {
    name: 'مدیریت میزکار‌ها',
    value: 'MANAGE_WORKSPACCE',
  },
] as const;

type Permission = (typeof PERMISSIONS)[number]['value'];
const PERMISSION_LIST = PERMISSIONS.map((p) => p.value);

export { PERMISSION_LIST };
export type { Permission };
export default PERMISSIONS;
