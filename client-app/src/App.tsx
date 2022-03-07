import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';
import { RequestType } from './scripts/connectionHandler/models/requestType';
import { JoinPayload, MovePayLoad, NewPlayerPayload, PlayerListPayload } from './scripts/connectionHandler/models/responses';

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
  }

  componentDidMount(){
    this.state.messageHandler.receiver.onMessages.set(RequestType.newPlayer,
      (payload: NewPlayerPayload) => this.setPlayerId(payload.id)
    );

    this.state.messageHandler.receiver.onMessages.set(RequestType.playerList,
      (payload: PlayerListPayload) => console.log(payload.list)
    );

    this.state.messageHandler.receiver.onMessages.set(RequestType.join,
      (payload: JoinPayload) => console.log(payload)
    );

    this.state.messageHandler.receiver.onMessages.set(RequestType.move,
      (payload: MovePayLoad) => console.log(payload)
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
