import { MessageType } from "./models/requestType";
import { SocketMessage } from "./models/socketMessage";
import { PlayerSocketConnection } from "./socketConnection";


export interface OnMessageFunction {
  type: MessageType,
  action: Function
}

export class MessageReceiver {
  socketConnection: PlayerSocketConnection = PlayerSocketConnection.getInstance();

  onMessages: Map<MessageType, Function> = new Map();
  
  constructor() {
    this.socketConnection.socket.onmessage = message => {
      const response: SocketMessage = JSON.parse(message.data);

      const action = this.onMessages.get(response.type);
      if(action !== undefined){
        action(response.payload);
      }
    }
  }
}