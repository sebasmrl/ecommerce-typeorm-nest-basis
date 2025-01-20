import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private readonly messageWsService: MessageWsService
  ){}

  handleConnection(client: Socket) {
    return `Cliente Conectado con id:${client.id}`;
  }
  handleDisconnect(client: any) {
    return `Cliente Desconectado con id:${client.id}`;
  }
}
