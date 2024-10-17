import { Socket } from "socket.io";
import { peers, rooms } from "api/constants/variableConstant";
import { NEW_PRODUCER } from "@shared/constants/mediasoupEventConstant";
import { IMediaProducer, IProceTransportAguments } from "@shared/interfaces/webRTCInterfaces";
import manageProducers from "./manageProducersProcessor";
import manageTransports from "./manageTransportsProcessor";

export const createProducerTransport = async (
  { kind, rtpParameters, appData }: IProceTransportAguments,
  callback: ({ id, producersExist }: { id: string; producersExist: boolean }) => void,
  socket: Socket
) => {
  try {
    const producer = await manageTransports.getTranport(socket.id)?.produce({
      kind,
      rtpParameters,
    });

    if (!producer) {
      return;
    }

    // add producer to the producers array
    const room_id = peers.get(socket.id).room_id;
    const newProducer:IMediaProducer = {producer, room_id, socketId:socket.id}
    manageProducers.addProducer(newProducer)

    console.log("Producer ID: ", producer.id, producer.kind);
    socket.to(room_id).emit(NEW_PRODUCER, { producerId: producer.id, socketId: socket.id });
    producer.on("transportclose", () => {
      console.log("transport for this producer closed ");
      producer.close();
    });

    // Send back to the client the Producer's id
    callback({
      id: producer.id as string,
      producersExist: manageProducers.getAllProducersForRoom(room_id, socket.id).length > 0 ? true : false,
    });
  } catch (error) {
    console.log("Getting Error While Produce Transport : ", (error as Error).message);
  }
};
