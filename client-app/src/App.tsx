import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import Toast from './components/toast/toast'
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';
import { MessageType } from './scripts/connectionHandler/models/requestType';
import { JoinResponsePayload, MoveResponsePayLoad, NewPlayerResponsePayload, PlayerListResponsePayload } from './scripts/connectionHandler/models/responses/payloads';

export interface AppProps {}

export interface AppStates {
  page: Pages;
  player: Player;
  messageHandler: PlayerSocketMessageHandler;
  showToast: boolean;
  toastMessage: string;
  toastType: string;
  toastHeaderMessage: string;
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
      messageHandler: new PlayerSocketMessageHandler(),
      showToast: false,
      toastMessage: '',
      toastType: '',
      toastHeaderMessage: ''
    }
  }

  componentDidMount(){
    this.state.messageHandler.receiver.onMessages.set(MessageType.newPlayer,
      (payload: NewPlayerResponsePayload) => this.setPlayerId(payload.id)
    );

    this.state.messageHandler.receiver.onMessages.set(MessageType.playerList,
      (payload: PlayerListResponsePayload) => console.log(payload.list)
    );

    this.state.messageHandler.receiver.onMessages.set(MessageType.join,
      (payload: JoinResponsePayload) => console.log(payload)
    );

    this.state.messageHandler.receiver.onMessages.set(MessageType.move,
      (payload: MoveResponsePayLoad) => console.log(payload)
    );
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

  setPlayerId = (id: String) => {
    this.setState({
      player: {
        ...this.state.player,
        id: id
      }
    });
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

  render() {
    return (
      <div>
        {
          this.state.page === 'connect' &&
          <Connect 
            onPageChange = {this.setPage}
            onPlayerConnect = {this.setPlayer}
            messageHandler =  {this.state.messageHandler}
          />
        }
        {
          this.state.page === 'game' && this.state.player.id !== '' &&
          <Game 
            onPageChange = {this.setPage}
            player = {this.state.player}
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
