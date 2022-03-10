import React from 'react';
import * as BS from 'react-bootstrap';

export interface ToastProps {
    message: string;
    setShowToast: Function;
    toastType: string; // types: 'primary','secondary','success','danger','warning','info','light','dark'
    headerMessage: string;
}

export interface ToastStates {
    showToast: boolean;
}

class Toast extends React.Component<ToastProps, ToastStates> {
  constructor(props: ToastProps) {
    super(props)
    
    this.state = {
        showToast: true
    }
  }

  closeToast() {
    this.setState({
        showToast: false
    })

    this.props.setShowToast(false)
  }

  render() {
    return (
    <div>
        <BS.ToastContainer  position={'top-end'} style={{padding: '10px'}}>
            <BS.Toast 
                show={this.state.showToast}
                onClose={() => this.closeToast()}
                delay={3000}
                autohide
                bg={this.props.toastType}
            >
                <BS.Toast.Header>
                    <strong className="me-auto">{this.props.headerMessage}</strong>
                </BS.Toast.Header>
                <BS.Toast.Body>{this.props.message}</BS.Toast.Body>
            </BS.Toast>
        </BS.ToastContainer>
    </div>
    );
  }
}

export default Toast;