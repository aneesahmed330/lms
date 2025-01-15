export interface IMail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: [];
}
