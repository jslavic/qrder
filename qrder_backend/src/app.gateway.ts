import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private socketService: SocketService) {}
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.socketService.socket = server;
    this.logger.log('running server');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() companyId: string,
  ) {
    client.join(companyId);
  }
}
