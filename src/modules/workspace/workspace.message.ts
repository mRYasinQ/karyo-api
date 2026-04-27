const WorkspaceMessage = {
  WORKSPACES_GET: 'میزکارها دریافت شدند.',
  WORKSPACE_GET: 'میزکار دریافت شد.',
  WORKSPACE_CREATED: 'میزکار ایجاد شد.',
  WORKSPACE_UPDATED: 'میزکار بروزرسانی شد.',
  WORKSPACE_DELETED: 'میزکار حذف شد.',

  MEMBERS_GET: 'اعضای میزکار دریافت شدند.',
  MEMBER_REMOVED: 'عضو از میزکار حذف شد.',
  MEMBER_ROLE_UPDATED: 'نقش عضو بروزرسانی شد.',
  MEMBER_LEAVED: 'شما میزکار را ترک کردید.',

  INVITATIONS_GET: 'دعوتنامه‌های شما دریافت شدند.',
  INVITE_SENT: 'در صورت وجود داشتن کاربر با ایمیل وارد شده، دعوتنامه ارسال خواهد شد.',
  INVITE_RESPONSE_SENT: 'پاسخ دعوتنامه با موفقیت ارسال شد.',

  SLUG_EXIST: 'شناسه کوتاه میزکار از قبل وجود دارد.',
  ALREADY_MEMBER: 'کاربر از قبل عضو میزکار می‌باشد.',
  INVITE_NOT_FOUND: 'دعوتنامه‌ای یافت نشد.',
  MEMBER_NOT_FOUND: 'عضو مورد نظر یافت نشد.',
  OWNER_ROLE_CANNOT_CHANGE: 'نقش مالک میزکار قابل تغییر نیست.',
  CANNOT_REMOVE_SELF: 'نمی‌توانید خود را از میزکار حذف کنید.',
  WORKSPACE_OWNER_CANNOT_LEAVE_OR_REMOVED: 'مالک میزکار نمی‌تواند میزکار را ترک کند یا حذف شود.',
  ADMIN_CANNOT_REMOVE_ADMIN: 'مدیر نمی‌تواند مدیر دیگر را حذف کند.',
} as const;

export default WorkspaceMessage;
