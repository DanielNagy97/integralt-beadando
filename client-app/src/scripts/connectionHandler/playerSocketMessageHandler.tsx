import { PlayerSocketConnection } from "./socketConnection";
import { MessageSender } from "./messageSender";
import { MessageReceiver} from "./messageReceiver";


export class PlayerSocketMessageHandler {
  socketConnection: PlayerSocketConnection;
  sender: MessageSender;
  receiver: MessageReceiver;

  constructor(onOpen: any, onClose: any) {
    this.socketConnection = PlayerSocketConnection.getInstance();
    this.sender = new MessageSender();
    this.receiver = new MessageReceiver();

    this.socketConnection.socket.onopen = onOpen;
    this.socketConnection.socket.onclose = onClose;
  }
}
