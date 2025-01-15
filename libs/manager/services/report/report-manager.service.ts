/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IReportService } from './report.service';

@Injectable()
export class ReportManagerService implements IReportService {
  constructor() {}
  userReport(userId: string) {
    throw new Error('Method not implemented.');
  }
}
