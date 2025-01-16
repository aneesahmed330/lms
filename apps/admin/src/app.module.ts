import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthenticationModule } from './auth/auth.module';
import { EnhancedLoggingInterceptor } from 'libs/building-block/interceptor/log.interceptor';
import { LecturesModule } from './lectures/lectures.module';
import { FileModule } from './fileManagement/fileManagement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/admin/.env',
    }),
    HealthModule,
    AuthenticationModule,
    UsersModule,
    CoursesModule,
    LecturesModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EnhancedLoggingInterceptor,
    },
  ],
})
export class AppModule {}
