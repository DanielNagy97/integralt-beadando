import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import Toast from './components/toast/toast'
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';
import { MessageType } from './scripts/connectionHandler/models/requestType';
import { CreateResponsePayload, JoinResponsePayload, PlayerListResponsePayload } from './scripts/connectionHandler/models/responses/payloads';
import { ErrorPayload } from './scripts/connectionHandler/models/errors/payloads';
import { ErrorHandler, ErrorMessage } from './scripts/errorHandler/errorHandler';
import { GameTypes } from './enums/game-types';

export interface AppProps {}

export interface AppStates {
  page: Pages;
  player: Player;
  gameId: string;
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
        name: '',
        gameType: GameTypes.AI_VS_AI
      },
      gameId: '',
      messageHandler: new PlayerSocketMessageHandler(this.onConnectionOpen, this.onConnectionClosed),
      showToast: false,
      toastMessage: '',
      toastType: '',
      toastHeaderMessage: '',
      errorHandler: new ErrorHandler()
    }
  }

  componentDidMount(){
    this.state.messageHandler.receiver.onMessages.set(MessageType.create,
      (payload: CreateResponsePayload) => {
        this.setGameId(payload.gameId);
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
    this.setPage(Pages.CONNECT);
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
          this.state.page === Pages.CONNECT &&
          <Connect 
            onPlayerConnect = {this.setPlayer}
            setGameId = {this.setGameId}
            messageHandler =  {this.state.messageHandler}
          />
        }
        {
          this.state.page === Pages.GAME &&
          <Game 
            onPageChange = {this.setPage}
            player = {this.state.player}
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
