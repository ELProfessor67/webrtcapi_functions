import * as mediasoup from "mediasoup";
import { IMediaConsumer } from "@shared/interfaces/webRTCInterfaces";

const manageConsumers = (() => {
  let consumers: IMediaConsumer[] = [];

  const addConsumer = (consumer: IMediaConsumer) => {
    consumers.push(consumer);
  };

  const removeBySocketId = (socketId: string) => {
    consumers = consumers.filter((consumer) => {
      if (consumer.socketId === socketId) {
        consumer.consumer?.close(); // Close the consumer
        return false; // Filter out the closed consumer
      }
      return true; // Keep other consumers
    });
  };

  const removeByConsumerId = (consumerId: string) => {
    consumers = consumers.filter((consumer) => consumer.consumer.id !== consumerId);
  };

  const findConsumerById = (consumerId: string): mediasoup.types.Consumer | undefined => {
    return consumers.find((consumer) => consumer.consumer.id === consumerId)?.consumer;
  };

  const getConsumerBySocketId = (socketId: string): mediasoup.types.Consumer | undefined => {
    return consumers.find((consumer) => consumer.socketId === socketId)?.consumer;
  };

  return {
    addConsumer,
    removeBySocketId,
    removeByConsumerId,
    findConsumerById,
    getConsumerBySocketId,
  };
})();

export default manageConsumers;
