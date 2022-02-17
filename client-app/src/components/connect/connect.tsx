import React from 'react';

export interface ConnectProps{}

export interface ConnectStates{}

class Connect extends React.Component<ConnectProps, ConnectStates> {
  constructor(props: ConnectProps){
    super(props)
  }

  render() {
    return (
        <div><p>Connect component works</p></div>
    );
  }
}

export default Connect;