import { RequestType } from "./models/requestType";
import { SocketMessage } from "./models/socketMessage";
import { PlayerSocketConnection } from "./socketConnection";


export interface OnMessageFunction {
  type: RequestType,
  action: Function
}

export class MessageReceiver {
  socketConnection: PlayerSocketConnection = PlayerSocketConnection.getInstance();

  onMessages: Map<RequestType, Function> = new Map();
  
  constructor() {
    this.socketConnection.socket.onmessage = message => {
      const response: SocketMessage = JSON.parse(message.data);

      this.onMessages.forEach( (action: Function, requestType: RequestType) => {
        if(response.type === requestType){
          action(response.payload);
        }
      });
    }
  }
}