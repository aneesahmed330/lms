import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Logger } from '@nestjs/common';
import { SocketEntity, User } from 'libs/manager/entities';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  constructor(
    @InjectRepository(SocketEntity)
    private readonly socketRepository: Repository<SocketEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  afterInit() {
    this.logger.log(`Web Socket Initialized`);
  }

  async handleConnection(client: Socket) {
    const { userId } = client.handshake.query;
    this.logger.log(`Client with ${client.id} connected`);
    if (!userId) {
      client.disconnect();
      return;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId as string },
    });

    if (!user) {
      client.disconnect();
      return;
    }
    const socketData = await this.socketRepository.findOne({
      where: { userId: { id: user.id } },
    });

    if (socketData) {
      await this.socketRepository.update(
        { id: socketData.id },
        { isOnline: true, socketId: client.id },
      );
    } else {
      const newSocket = this.socketRepository.create({
        socketId: client.id,
        isOnline: true,
        userId: user,
      });
      await this.socketRepository.save(newSocket);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client with ${client.id} disconnected`);
    await this.socketRepository.update(
      { socketId: client.id },
      { isOnline: false },
    );
  }

  sendNotification(clientId: string, notification: any) {
    try {
      this.server.to(clientId).emit('notification', notification);
      this.logger.log(`Notification send to ${clientId}`);
    } catch (error) {
      this.logger.log(`Error while sending notification to ${clientId}`);
    }
  }
}
