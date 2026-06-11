interface MailData {
  mail: string;
  title: string;
  message: string;
  type?: string;
}

interface MailProcessResult {
  success: boolean;
}

export type { MailData, MailProcessResult };
