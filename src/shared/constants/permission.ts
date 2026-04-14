const PERMISSIONS = [
  {
    name: 'مشاهده نقش',
    value: 'SHOW_ROLE',
  },
  {
    name: 'ایجاد نقش',
    value: 'CREATE_ROLE',
  },
  {
    name: 'ویرایش نقش',
    value: 'UPDATE_ROLE',
  },
  {
    name: 'ویرایش نقش',
    value: 'DELETE_ROLE',
  },
  {
    name: 'مشاهده کاربر',
    value: 'SHOW_USER',
  },
  {
    name: 'ایجاد کاربر',
    value: 'CREATE_USER',
  },
  {
    name: 'ویرایش کاربر',
    value: 'UPDATE_USER',
  },
  {
    name: 'ویرایش کاربر',
    value: 'DELETE_USER',
  },
] as const;

type Permission = (typeof PERMISSIONS)[number]['value'];
const PERMISSION_LIST = PERMISSIONS.map((p) => p.value);

export { PERMISSION_LIST };
export type { Permission };
export default PERMISSIONS;
