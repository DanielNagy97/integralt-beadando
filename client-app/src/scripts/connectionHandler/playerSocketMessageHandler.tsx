import { PlayerSocketConnection } from "./socketConnection";
import { MessageSender } from "./messageSender";
import { MessageReceiver} from "./messageReceiver";


export class PlayerSocketMessageHandler {
  socketConnection: PlayerSocketConnection;
  sender: MessageSender;
  receiver: MessageReceiver;

  onOpens: Function[] = [];
  onCloses: Function[] = [];

  constructor(onOpen: any, onClose: any) {
    this.socketConnection = PlayerSocketConnection.getInstance();
    this.sender = new MessageSender();
    this.receiver = new MessageReceiver();

    this.onCloses.push(() => {
      setTimeout(()=> {
        this.socketConnection.connect();
        this.setOnOpenAndOnCloseEvents();
        this.receiver.setOnMessageEvents();
      }, 1000);
    });

    this.onOpens.push(onOpen);
    this.onCloses.push(onClose);

    this.setOnOpenAndOnCloseEvents()
  }

  setOnOpenAndOnCloseEvents = () => {
    this.socketConnection.socket.onopen = () => { this.onOpens.forEach(openFunction => {
      openFunction();
    })};

    this.socketConnection.socket.onclose = () => { this.onCloses.forEach(closeFunction => {
      closeFunction();
    })};
  }
}
