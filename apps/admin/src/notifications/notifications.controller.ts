import { INotificationService } from '@app/manager/notification/notification.service';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'libs/building-block/RequestableDTOs/notification';
import { Notification } from 'libs/manager/entities';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: INotificationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new notification',
    description: 'Creates a new notification and assigns it to specified users',
  })
  @ApiBody({
    type: CreateNotificationDto,
    description: 'Notification creation payload',
    examples: {
      example1: {
        value: {
          text: 'New course available: Introduction to TypeScript',
          userIds: ['uuid1', 'uuid2'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: Notification,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all notifications',
    description: 'Retrieves a list of all notifications in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications retrieved successfully',
    type: [Notification],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get user notifications',
    description: 'Retrieves all notifications for a specific user',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'The UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user notifications retrieved successfully',
    type: [Notification],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findByUserId(@Param('userId') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get notification by ID',
    description: 'Retrieves a specific notification by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the notification',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification details retrieved successfully',
    type: Notification,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update notification',
    description: 'Updates an existing notification by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the notification to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateNotificationDto,
    description: 'Notification update payload',
    examples: {
      example1: {
        value: {
          text: 'Updated notification text',
          userIds: ['uuid1', 'uuid3'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: Notification,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete notification',
    description: 'Deletes a notification by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The UUID of the notification to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token is missing or invalid',
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  remove(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
