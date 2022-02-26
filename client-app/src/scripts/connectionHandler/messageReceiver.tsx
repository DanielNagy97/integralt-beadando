import { RequestType } from "./models/requestType";
import { NewPlayerPayload, PlayerListPayload } from "./models/responses";
import { SocketMessage } from "./models/socketMessage";
import { PlayerSocketConnection } from "./socketConnection";


export class MessageReceiver {
    socketConnection: PlayerSocketConnection;

    constructor(setPlayerId: Function){
      this.socketConnection = PlayerSocketConnection.getInstance();

      this.socketConnection.socket.onmessage = message => {
        const response: SocketMessage = JSON.parse(message.data);
  
        if (response.type === RequestType.newPlayer) {
          const payload: NewPlayerPayload = response.payload;
          setPlayerId(payload.id); // Modifying the App's state
        }
        else if (response.type === RequestType.playerList) {
          const payload: PlayerListPayload = response.payload;
          console.log(payload);
        }
      }
    }


}