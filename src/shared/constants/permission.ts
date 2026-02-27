const PERMISSIONS = [
  {
    name: 'نمایش نقش',
    value: 'SHOW_ROLE',
  },
  {
    name: 'ایجاد نقش',
    value: 'CREATE_ROLE',
  },
  {
    name: 'بروزرسانی نقش',
    value: 'UPDATE_ROLE',
  },
  {
    name: 'حذف نقش',
    value: 'DELETE_ROLE',
  },
] as const;

type Permission = (typeof PERMISSIONS)[number]['value'];
const PERMISSION_LIST = PERMISSIONS.map((p) => p.value);

export { PERMISSION_LIST };
export type { Permission };
export default Permissions;
