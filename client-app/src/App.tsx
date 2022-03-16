import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import Toast from './components/toast/toast'
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';
import { MessageType } from './scripts/connectionHandler/models/requestType';
import { JoinResponsePayload, PlayerListResponsePayload } from './scripts/connectionHandler/models/responses/payloads';
import { ErrorPayload } from './scripts/connectionHandler/models/errors/payloads';
import { ErrorHandler, ErrorMessage } from './scripts/errorHandler/errorHandler';

export interface AppProps {}

export interface AppStates {
  page: Pages;
  player: Player;
  gameId: string;
  joinPayload: JoinResponsePayload | undefined;
  messageHandler: PlayerSocketMessageHandler;
  showToast: boolean;
  toastMessage: string;
  toastType: string;
  toastHeaderMessage: string;
  errorHandler: ErrorHandler;
}

class App extends React.Component<AppProps, AppStates> {

  constructor(props: AppProps) {
    super(props)
  
    this.state = {
      page: Pages.CONNECT,
      player: {
        id: '',
        name: ''
      },
      gameId: '',
      joinPayload: undefined,
      messageHandler: new PlayerSocketMessageHandler(this.onConnectionOpen, this.onConnectionClosed),
      showToast: false,
      toastMessage: '',
      toastType: '',
      toastHeaderMessage: '',
      errorHandler: new ErrorHandler()
    }
  }

  componentDidMount(){
    this.state.messageHandler.receiver.onMessages.set(MessageType.join,
      (payload: JoinResponsePayload) => {
        this.setState({
          joinPayload: payload
        })
        this.setPage(Pages.GAME);
      }
    );

    this.state.messageHandler.receiver.onMessages.set(MessageType.error,
      (payload: ErrorPayload) => {
        const errorMessage: ErrorMessage = this.state.errorHandler.handleError(payload);
        this.setToastAttributes(errorMessage.message, errorMessage.type, errorMessage.headerMessage);
        this.setShowToast(true);
      }
    );

    // NOTE: Unused
    this.state.messageHandler.receiver.onMessages.set(MessageType.playerList,
      (payload: PlayerListResponsePayload) => console.log(payload.list)
    );
  }

  onConnectionOpen = () => {
    this.setToastAttributes("The connection to the server is alive" , "success", "Connected to server");
    this.setShowToast(true);
  }

  onConnectionClosed = () => {
    this.setToastAttributes("Connection to the server was lost" , "secondary", "Disconnected from server");
    this.setShowToast(true);
  }

  setPage = (page: Pages) => {
    this.setState({
      page: page
    })
  }

  setPlayer = (player: Player) => {
      this.setState({
        player: player
      })
  }

  setShowToast = (show: boolean) => {
    this.setState({
      showToast: show
    });
  }

  setToastAttributes = (message: string, type: string, headerMessage: string) => {
    this.setState({
      toastMessage: message,
      toastType: type,
      toastHeaderMessage: headerMessage
    });
  }

  setGameId = (id: string) => {
    this.setState({
      gameId: id
    })
  }

  render() {
    return (
      <div>
        {
          this.state.page === 'connect' &&
          <Connect 
            onPageChange = {this.setPage}
            onPlayerConnect = {this.setPlayer}
            setGameId = {this.setGameId}
            messageHandler =  {this.state.messageHandler}
          />
        }
        {
          this.state.page === 'game' && this.state.joinPayload !== undefined &&
          <Game 
            onPageChange = {this.setPage}
            player = {this.state.player}
            joinPayload = {this.state.joinPayload}
            gameId = {this.state.gameId}
            messageHandler =  {this.state.messageHandler}
          />
        }
        {
          this.state.showToast &&
          <Toast 
            message={this.state.toastMessage}
            setShowToast={this.setShowToast}
            toastType={this.state.toastType}
            headerMessage={this.state.toastHeaderMessage}
          />
        }
      </div>
    )
  }
}

export default App;
