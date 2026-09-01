import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.hubConnection = null;
  }

  async connect() {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return this.hubConnection;
    }

    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_BASE_URL}/processOrder`)
        .withAutomaticReconnect()
        .build();

      await this.hubConnection.start();
      console.log('✅ Connected to SignalR hub');
      return this.hubConnection;
    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
      console.log('Disconnected from SignalR hub');
    }
  }

  onReceiveWebOrder(callback) {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveWebOrder', callback);
    }
  }

  offReceiveWebOrder() {
    if (this.hubConnection) {
      this.hubConnection.off('ReceiveWebOrder');
    }
  }

  getConnectionState() {
    return this.hubConnection?.state;
  }
}

export default new SignalRService();
