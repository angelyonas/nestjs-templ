import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';
import { Server } from 'tls';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

enum SOCKET_EVENTS {
  CLIENTS_UPDATED = 'clients-updated',
  MESSAGE_CLIENT = 'message-from-client',
  MESSAGE_SERVER = 'message-from-server',
}

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      SOCKET_EVENTS.CLIENTS_UPDATED,
      this.messagesWsService.getConnectedClients(),
    );
  }
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
      this.wss.emit(
        SOCKET_EVENTS.CLIENTS_UPDATED,
        this.messagesWsService.getConnectedClients(),
      );
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.MESSAGE_CLIENT)
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);

    const user = this.messagesWsService.getUserDataBySocket(client.id);

    /* Emitir solo cliente local
      client.emit(SOCKET_EVENTS.MESSAGE_SERVER, {
        fullName: 'Soy yo!',
        message: payload.message || 'no-message',
      });
    */

    /* Emitir todos menos el local  
    client.broadcast.emit(SOCKET_EVENTS.MESSAGE_SERVER, {
      fullName: 'Soy yo!',
      message: payload.message || 'no-message',
    });
    */

    this.wss.emit(SOCKET_EVENTS.MESSAGE_SERVER, {
      fullName: user.fullname,
      message: payload.message || 'no-message',
    });
  }
}
