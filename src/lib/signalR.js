//connect to azure signalR service
import * as signalR from "@microsoft/signalr";

//class to connect to azure signalR service with connection string retrieved from .env file in root folder
//connection must be singleton
class SignalRService {
  //singleton instance
  static instance = null;

  //connection string
  connectionString = process.env.REACT_APP_SIGNALR_CONNECTION_STRING;

  //connection
  connection = null;

  //constructor
  constructor() {
    if (!SignalRService.instance) {
      SignalRService.instance = this;
    }
    return SignalRService.instance;
  }

  //connect to signalR service
  connect = () => {
    //if already connected, return
    if (this.connection) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.connectionString)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    this.connection.start().catch(err =>{
      console.error(err.toString())
      throw err;
    });
  }

  //disconnect from signalR service
  disconnect = () => {
    this.connection.stop();
    this.connection = null;
  }

  //register a callback function to be called when a message is received
  registerReceiveMessage = (message, callback) => {
    this.connection.on(message, callback);
  }

  //send a message to signalR service with error handling
  sendMessage = (message, ...data) => {
    if(this.connection === null) {
      throw new Error("Not connected to SignalR service");
    }
    this.connection.invoke(message, ...data).catch(err => {
      console.error(err.toString());
      throw err;
    });
  }
}

export {SignalRService};
