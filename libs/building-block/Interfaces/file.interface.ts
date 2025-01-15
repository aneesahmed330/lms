export interface IFile {
  size: number;
  buffer: Buffer;
  encoding: string;
  mimetype: string;
  fieldname: string;
  originalname: string;
}
