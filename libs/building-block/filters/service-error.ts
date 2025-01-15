import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class ServiceError extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: string,
    public readonly message: string,
    public readonly apiMessage: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.id = randomUUID();
    this.timestamp = new Date();
  }
}
