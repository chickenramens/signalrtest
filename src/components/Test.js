import {useState} from "react";
import {SignalRService} from "../lib/signalR";

const Test = () => {

  const [signalR, setSignalR] = useState(null);
  const [messages, setMessages] = useState([]);

  const connect = (e) => {
    //connect to signalR service using SignalRService class
    const signalR = new SignalRService();
    signalR.connect();
    setSignalR(signalR);
    signalR.registerReceiveMessage("broadcastMessage", (name, message) => {
      console.log(name + ":" + message);
      setMessages(prevMessages => [...prevMessages, message]);
    });
  }

  return (
    <>
      {messages}
      <button onClick={() => {signalR.disconnect()}}>Close</button>
      <button onClick={connect}>Connect</button>
      <button onClick={() => {signalR.sendMessage("broadcastMessage", "mike davis", "Hello World")}}>Send Message</button>
    </>
  )
}

export {Test};
