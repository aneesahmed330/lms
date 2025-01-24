import { Module } from '@nestjs/common';
import { classes } from '@automapper/classes';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { createDatabase } from 'typeorm-extension';

import { BullMQModule } from '../modules/src/bullmq/bullmq.module';
import { DatabaseModule } from '../modules/src/db/database.module';
import { IUserService } from './services/user/user.service';
import { UserManagerService } from './services/user/user-manager.service';
import { IS3Service } from './services/s3/s3.service';
import { S3ManagerService } from './services/s3/s3-manager.service';
import { IMailService } from './services/mail/mail.service';
import { MailManagerService } from './services/mail/mail-manager.service';
import { NotificationGateway } from './services/socket/socket.gateway';

import { IReportService } from './services/report/report.service';
import { ReportManagerService } from './services/report/report-manager.service';

import { JwtService } from '@nestjs/jwt';
import { ICourseService } from './services/course/course.service';
import { CourseManagerService } from './services/course/course-manager.service';
import { ILectureService } from './services/lecture/lecture.service';
import { LectureManagerService } from './services/lecture/lecture-manager.service';
import { INotificationService } from './services/notification/notification.service';
import { NotificationManagerService } from './services/notification/notification-manager.service';

@Module({
  imports: [
    BullMQModule,
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await createDatabase({
          ifNotExist: true,
          options: {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: 5432,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
          },
        });
        return {
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          schema: process.env.POSTGRES_SCHEMA,
          synchronize: false,
          logging: false,
          autoLoadEntities: true,
          migrations: ['dist/migrations/*{.ts,.js}'],
          migrationsTableName: 'migrations_typeorm',
          migrationsRun: false,
        };
      },
    }),
    DatabaseModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    NotificationGateway,
    JwtService,
    {
      provide: IUserService,
      useClass: UserManagerService,
    },
    {
      provide: ICourseService,
      useClass: CourseManagerService,
    },
    {
      provide: ILectureService,
      useClass: LectureManagerService,
    },

    {
      provide: IS3Service,
      useClass: S3ManagerService,
    },
    {
      provide: IMailService,
      useClass: MailManagerService,
    },
    {
      provide: IReportService,
      useClass: ReportManagerService,
    },
    {
      provide: INotificationService,
      useClass: NotificationManagerService,
    },
  ],
  exports: [
    NotificationGateway,
    IReportService,
    IUserService,
    IS3Service,
    ICourseService,
    ILectureService,
    IMailService,
    INotificationService,
  ],
})
export class ManagerModule {}
