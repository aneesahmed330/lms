import { Notification } from 'libs/manager/entities';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from 'libs/building-block/RequestableDTOs/notification';

export abstract class INotificationService {
  /**
   * Create a new notification.
   * @param createNotificationDto Payload to create a notification.
   * @returns The created notification.
   */
  abstract create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification>;

  /**
   * Retrieve all notifications.
   * @returns A list of notifications.
   */
  abstract findAll(): Promise<Notification[]>;

  /**
   * Retrieve notifications for a specific user.
   * @param userId The ID of the user.
   * @returns A list of notifications.
   */
  abstract findByUserId(userId: string): Promise<Notification[]>;

  /**
   * Retrieve a single notification by ID.
   * @param id The ID of the notification.
   * @returns The notification if found.
   */
  abstract findOne(id: string): Promise<Notification>;

  /**
   * Update a notification.
   * @param id The ID of the notification to update.
   * @param updateNotificationDto Payload to update the notification.
   * @returns The updated notification.
   */
  abstract update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification>;

  /**
   * Delete a notification.
   * @param id The ID of the notification to delete.
   * @returns A promise indicating the operation's success.
   */
  abstract delete(id: string): Promise<void>;
}
