//unit test for SignalRService
describe('SignalRService', () => {
  //mock signalR
  jest.mock('@aspnet/signalr', () => {
    return {
      HubConnectionBuilder: jest.fn().mockImplementation(() => {
        return {
          withUrl: jest.fn().mockImplementation(() => {
            return {
              build: jest.fn().mockImplementation(() => {
                return {
                  start: jest.fn(),
                  stop: jest.fn(),
                  on: jest.fn(),
                  invoke: jest.fn()
                };
              })
            };
          })
        };
      })
    };
  })

  //mock process.env
  jest.mock('process', () => {
    return {
      env: {
        REACT_APP_SIGNALR_CONNECTION_STRING: 'connection string'
      }
    };
  })

  //mock console.error
  console.error = jest.fn();

  //mock SignalRService
  const SignalRService = require('./signalR').default;

  //mock connection
  const connection = {
    start: jest.fn(),
    stop: jest.fn(),
    on: jest.fn(),
    invoke: jest.fn()
  };

  //mock HubConnectionBuilder
  const HubConnectionBuilder = require('@aspnet/signalr').HubConnectionBuilder;
  HubConnectionBuilder.mockImplementation(() => {
    return {
      withUrl: jest.fn().mockImplementation(() => {
        return {
          build: jest.fn().mockImplementation(() => {
            return connection;
          })
        };
      })
    };
  });

  //mock SignalRService.instance
  SignalRService.instance = {
    connection: connection
  };

  //test constructor
  test('constructor', () => {
    //arrange
    //act
    const signalRService = new SignalRService();

    //assert
    expect(signalRService).toBe(SignalRService.instance);
  });

  //test connect
  test('connect', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.connect();

    //assert
    expect(HubConnectionBuilder).toHaveBeenCalledWith();
    expect(HubConnectionBuilder().withUrl).toHaveBeenCalledWith('connection string');
    expect(HubConnectionBuilder().withUrl().build).toHaveBeenCalledWith();
    expect(HubConnectionBuilder().withUrl().build().start).toHaveBeenCalledWith();
  });

  //test disconnect
  test('disconnect', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.disconnect();

    //assert
    expect(connection.stop).toHaveBeenCalledWith();
  });

  //test registerReceiveMessage
  test('registerReceiveMessage', () => {
    //arrange
    const signalRService = new SignalRService();
    const callback = jest.fn();

    //act
    signalRService.registerReceiveMessage('message', callback);

    //assert
    expect(connection.on).toHaveBeenCalledWith('message', callback);
  });

  //test sendMessage
  test('sendMessage', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.sendMessage('message', 'data');

    //assert
    expect(connection.invoke).toHaveBeenCalledWith('message', 'data');
  });

  //test error
  test('error', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.error('error');

    //assert
    expect(console.error).toHaveBeenCalledWith('error');
  });

  //test connectionClosed
  test('connectionClosed', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.connectionClosed();

    //assert
    expect(console.error).toHaveBeenCalledWith('connection closed');
  });

  //test connectionReconnecting
  test('connectionReconnecting', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.connectionReconnecting();

    //assert
    expect(console.error).toHaveBeenCalledWith('connection reconnecting');
  });

  //test connectionReconnected
  test('connectionReconnected', () => {
    //arrange
    const signalRService = new SignalRService();

    //act
    signalRService.connectionReconnected();

    //assert
    expect(console.error).toHaveBeenCalledWith('connection reconnected');
  });

});
