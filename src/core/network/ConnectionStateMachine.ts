export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING_WIFI = 'CONNECTING_WIFI',
  CONNECTED_WIFI = 'CONNECTED_WIFI',
  CONNECTING_BLUETOOTH = 'CONNECTING_BLUETOOTH',
  CONNECTED_BLUETOOTH = 'CONNECTED_BLUETOOTH',
  SWITCHING = 'SWITCHING',
}

export enum ConnectionEvent {
  WIFI_AVAILABLE = 'WIFI_AVAILABLE',
  WIFI_UNAVAILABLE = 'WIFI_UNAVAILABLE',
  BLUETOOTH_AVAILABLE = 'BLUETOOTH_AVAILABLE',
  BLUETOOTH_UNAVAILABLE = 'BLUETOOTH_UNAVAILABLE',
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  DISCONNECT = 'DISCONNECT',
}

export class ConnectionStateMachine {
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private onStateChange: (state: ConnectionState) => void;

  constructor(onStateChange: (state: ConnectionState) => void) {
    this.onStateChange = onStateChange;
  }

  transition(event: ConnectionEvent): ConnectionState {
    const previousState = this.state;

    switch (this.state) {
      case ConnectionState.DISCONNECTED:
        if (event === ConnectionEvent.WIFI_AVAILABLE) {
          this.state = ConnectionState.CONNECTING_WIFI;
        } else if (event === ConnectionEvent.BLUETOOTH_AVAILABLE) {
          this.state = ConnectionState.CONNECTING_BLUETOOTH;
        }
        break;

      case ConnectionState.CONNECTING_WIFI:
        if (event === ConnectionEvent.CONNECTION_SUCCESS) {
          this.state = ConnectionState.CONNECTED_WIFI;
        } else if (event === ConnectionEvent.CONNECTION_FAILED) {
          this.state = ConnectionState.CONNECTING_BLUETOOTH;
        }
        break;

      case ConnectionState.CONNECTED_WIFI:
        if (event === ConnectionEvent.WIFI_UNAVAILABLE) {
          this.state = ConnectionState.SWITCHING;
        } else if (event === ConnectionEvent.DISCONNECT) {
          this.state = ConnectionState.DISCONNECTED;
        }
        break;

      case ConnectionState.CONNECTING_BLUETOOTH:
        if (event === ConnectionEvent.CONNECTION_SUCCESS) {
          this.state = ConnectionState.CONNECTED_BLUETOOTH;
        } else if (event === ConnectionEvent.CONNECTION_FAILED) {
          this.state = ConnectionState.DISCONNECTED;
        }
        break;

      case ConnectionState.CONNECTED_BLUETOOTH:
        if (event === ConnectionEvent.WIFI_AVAILABLE) {
          this.state = ConnectionState.SWITCHING;
        } else if (event === ConnectionEvent.DISCONNECT) {
          this.state = ConnectionState.DISCONNECTED;
        }
        break;

      case ConnectionState.SWITCHING:
        if (event === ConnectionEvent.CONNECTION_SUCCESS) {
          this.state = ConnectionState.CONNECTED_WIFI;
        } else if (event === ConnectionEvent.CONNECTION_FAILED) {
          this.state = ConnectionState.CONNECTED_BLUETOOTH;
        }
        break;
    }

    if (previousState !== this.state) {
      this.onStateChange(this.state);
    }

    return this.state;
  }

  getState(): ConnectionState {
    return this.state;
  }

  reset(): void {
    this.state = ConnectionState.DISCONNECTED;
  }
}
