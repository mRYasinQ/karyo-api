interface MailData {
  mail: string;
  title: string;
  message: string;
}

interface SendMailOptions extends MailData {
  jobName?: string;
}

interface MailProcessResult {
  success: boolean;
}

export type { MailData, SendMailOptions, MailProcessResult };
