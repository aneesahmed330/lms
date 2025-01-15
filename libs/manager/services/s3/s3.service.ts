import { S3 } from 'aws-sdk';
export abstract class IS3Service {
  abstract generateUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ url: string; key: string }>;

  abstract getFile(
    key: string,
    hours?: number,
    expires?: boolean,
  ): Promise<string>;
  abstract uploadFile(
    file: Buffer | object,
    key: string,
    type?: string,
  ): Promise<S3.ManagedUpload.SendData>;

  abstract removeFiles(keys: string[]): Promise<void>;
}
