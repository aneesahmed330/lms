import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { IsPublic } from 'libs/building-block/Decorators/isPublic';

@ApiTags('Health')
@IsPublic()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @ApiOperation({ summary: 'User able to check the database connectivity.' })
  @Get('/databaseCheck')
  @HealthCheck()
  dbCheck() {
    return this.health.check([() => this.database.pingCheck('postgres')]);
  }

  @ApiOperation({
    summary:
      'User able to check the memory allocation. i.e mem > 150MB bad state',
  })
  @Get('/RssMemCheck')
  @HealthCheck()
  rssCheck() {
    return this.health.check([
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @ApiOperation({
    summary: 'User able to check the disk allocation. i.e 70% threshold',
  })
  @Get('/diskHealthCheck')
  @HealthCheck()
  diskHealthCheck() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.7 }),
    ]);
  }
}
