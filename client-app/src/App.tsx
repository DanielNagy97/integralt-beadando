import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';
import { SocketMessage } from './scripts/connectionHandler/models/socketMessage';
import { NewPlayerPayload, PlayerListPayload } from './scripts/connectionHandler/models/responses';
import { RequestType } from './scripts/connectionHandler/models/requestType';

export interface AppProps {}

export interface AppStates {
  page: Pages;
  player: Player;
  messageHandler: PlayerSocketMessageHandler;
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
      messageHandler: new PlayerSocketMessageHandler()
    }

    // TODO: Find a way to modify the state of the player from outside of the component!
    // This onmessage code should not be here!
    this.state.messageHandler.socketConnection.socket.onmessage = message => {
      const response: SocketMessage = JSON.parse(message.data);
  
      if (response.type === RequestType.newPlayer) {
        const payload: NewPlayerPayload = response.payload;
        this.setPlayer({...this.state.player, id: payload.id})
      }
      else if (response.type === RequestType.playerList) {
        const payload: PlayerListPayload = response.payload;
        console.log(payload);
      }
    }
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
      </div>
    )
  }

}

export default App;
