import { PlayerSocketConnection } from "./socketConnection";
import { MessageSender } from "./messageSender";
import { MessageReceiver} from "./messageReceiver";


export class PlayerSocketMessageHandler {
  socketConnection: PlayerSocketConnection;
  sender: MessageSender;
  receiver: MessageReceiver;

  constructor() {
    this.socketConnection = PlayerSocketConnection.getInstance();
    this.sender = new MessageSender();
    this.receiver = new MessageReceiver();

    this.socketConnection.socket.onopen = this.onOpen;
    this.socketConnection.socket.onclose = this.onClose;
  }

  onOpen() {
    // TODO: Pass the result to the component!
    console.log("Connected to server!");
  }

  onClose() {
    // TODO: Pass the result to the component!
    console.log("Disconected from server!");
  }
}
