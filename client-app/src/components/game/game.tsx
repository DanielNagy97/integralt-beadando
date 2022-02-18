import React from 'react';
import { Player } from '../../models/player';

export interface GameProps{
  onPageChange: Function;
  player: Player;
}

export interface GameStates{}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)
  }

  render() {
    return (
        <div>
          <p>Game component works</p> 
          <p>{this.props.player.name}</p>
        </div>
    );
  }
}

export default Game;