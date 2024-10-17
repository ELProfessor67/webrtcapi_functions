import * as mediasoup from "mediasoup";
import { IMediaProducer, IProducerData } from "@shared/interfaces/webRTCInterfaces";

const manageProducers = (() => {
  let producers: IMediaProducer[] = [];

  const addProducer = (producer: IMediaProducer) => {
    producers.push(producer);
  };

  const removeProducerBySocketId = (socketId: string) => {
    producers = producers.filter((producer) => {
      if (producer.socketId === socketId) {
        producer.producer?.close(); // Close the producer before removal
        return false; // Remove from list
      }
      return true; // Keep other producers
    });
  };

  const getProducerBySocketId = (socketId: string): mediasoup.types.Producer | undefined => {
    return producers.find((producer) => producer.socketId === socketId)?.producer;
  };

  const getAllProducersForRoom = (roomId: string, socketId: string): IProducerData[] => {
    return producers
      .filter((producer) => producer.room_id === roomId && producer.socketId !== socketId)
      .map((producer) => ({
        producerId: producer.producer.id,
        socketId: producer.socketId,
      }));
  };

  return {
    addProducer,
    removeProducerBySocketId,
    getProducerBySocketId,
    getAllProducersForRoom,
  };
})();

export default manageProducers;
