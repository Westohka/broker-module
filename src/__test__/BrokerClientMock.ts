import BrokerClient from '../broker.client';

export default () => {
  const BrokerClientMock = jest.mocked(BrokerClient, true);

  const sendMock = jest.fn((queue: string, msg: any) => void 0);
  const closeMock = jest.fn((...args) => void 0);
  const subscribeMock = jest.fn((...args) => void 0);

  BrokerClientMock.mockImplementation((): any => {
    return {
      subscribe: subscribeMock,
      close: closeMock,
      send: sendMock,
    };
  });

  return {
    send: sendMock,
    close: closeMock,
    subscribe: subscribeMock,
  };
};
