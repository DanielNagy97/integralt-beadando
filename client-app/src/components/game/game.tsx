import React from 'react';


export interface GameProps{}

export interface GameStates{}

class Game extends React.Component<GameProps, GameStates> {
  constructor(props: GameProps){
    super(props)
  }

  render() {
    return (
        <div><p>Game component works</p></div>
    );
  }
}

export default Game;