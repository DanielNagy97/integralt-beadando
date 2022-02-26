import React from 'react';
import './App.css';
import Connect from './components/connect/connect';
import Game from './components/game/game';
import { Player } from '../src/models/player';
import { Pages } from '../src/enums/pages';
import { PlayerSocketMessageHandler } from './scripts/connectionHandler/playerSocketMessageHandler';

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
          this.state.page === 'game' &&
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
