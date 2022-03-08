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

      this.onMessages.forEach( (action: Function, requestType: MessageType) => {
        if(response.type === requestType){
          action(response.payload);
        }
      });
    }
  }
}