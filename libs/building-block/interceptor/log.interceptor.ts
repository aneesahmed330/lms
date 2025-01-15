import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

interface RequestMetrics {
  requestId: string;
  timestamp: string;
  method: string;
  path: string;
  query: Record<string, any>;
  body: Record<string, any>;
  ip: string;
  userAgent: string;
  duration: number;
  statusCode: number;
  memory: {
    before: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    after: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    system: {
      total: number;
      free: number;
      usage: number;
    };
  };
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

@Injectable()
export class EnhancedLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(EnhancedLoggingInterceptor.name);

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  private getSystemMetrics() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return {
      total: totalMemory,
      free: freeMemory,
      usage: (usedMemory / totalMemory) * 100,
    };
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      'password',
      'token',
      'authorization',
      'secret',
      'key',
    ];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private formatMetrics(metrics: RequestMetrics): string {
    const { requestId, timestamp, method, path, duration, statusCode, memory } =
      metrics;

    return [
      `🔍 Request ID: ${requestId}`,
      `⏱️  ${timestamp}`,
      `📡 ${method} ${path}`,
      `⚡ Duration: ${duration}ms`,
      `📊 Status: ${statusCode}`,
      '📈 Memory Usage:',
      `  Before: ${this.formatBytes(memory.before.heapUsed)}`,
      `  After: ${this.formatBytes(memory.after.heapUsed)}`,
      `  Difference: ${this.formatBytes(memory.after.heapUsed - memory.before.heapUsed)}`,
      `🖥️  System Memory: ${memory.system.usage.toFixed(2)}%`,
    ].join('\n');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const requestId = uuidv4();
    const request = context.switchToHttp().getRequest<Request>();
    const memoryBefore = process.memoryUsage();

    // Create initial metrics object
    const metrics: RequestMetrics = {
      requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.path,
      query: this.sanitizeData(request.query),
      body: this.sanitizeData(request.body),
      ip: request.ip,
      userAgent: request.get('user-agent') || 'unknown',
      duration: 0,
      statusCode: 0,
      memory: {
        before: {
          heapUsed: memoryBefore.heapUsed,
          heapTotal: memoryBefore.heapTotal,
          external: memoryBefore.external,
          rss: memoryBefore.rss,
        },
        after: {
          heapUsed: 0,
          heapTotal: 0,
          external: 0,
          rss: 0,
        },
        system: this.getSystemMetrics(),
      },
    };

    return next.handle().pipe(
      tap(() => {
        const memoryAfter = process.memoryUsage();
        const response = context.switchToHttp().getResponse<Response>();

        metrics.duration = Date.now() - startTime;
        metrics.statusCode = response.statusCode;
        metrics.memory.after = {
          heapUsed: memoryAfter.heapUsed,
          heapTotal: memoryAfter.heapTotal,
          external: memoryAfter.external,
          rss: memoryAfter.rss,
        };

        this.logger.log(this.formatMetrics(metrics));

        // Log detailed metrics if significant memory increase
        const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
        if (memoryIncrease > 50 * 1024 * 1024) {
          // 50MB threshold
          this.logger.warn(
            `⚠️ Significant memory increase detected: ${this.formatBytes(memoryIncrease)}`,
          );
        }
      }),
      catchError((error) => {
        metrics.duration = Date.now() - startTime;
        metrics.statusCode = error.status || 500;
        metrics.error = {
          message: error.message,
          stack: error.stack,
          code: error.code,
        };

        this.logger.error(
          `❌ Error in request ${metrics.requestId}:\n${this.formatMetrics(metrics)}`,
          error.stack,
        );

        return throwError(() => error);
      }),
    );
  }
}
