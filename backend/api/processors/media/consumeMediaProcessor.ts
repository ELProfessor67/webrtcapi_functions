import { IComsumeMediaArgument } from "@shared/interfaces/webRTCInterfaces";
import { peers, rooms } from "../../constants/variableConstant";
import { addConsumer } from "api/services/webRTC/webRTCService";
import { Router } from "mediasoup/node/lib/types";
import { Socket } from "socket.io";
import consumerManager from "../webRTC/manageConsumersProcessor";
import manageTransports from "../webRTC/manageTransportsProcessor";

export const consumeMedia = async (
  { rtpCapabilities, remoteProducerId, serverConsumerTransportId }: IComsumeMediaArgument,
  callback: ({ params }: { params: any }) => void,
  socket: Socket
) => {
  try {
    const room_id: string = peers.get(socket.id).room_id;
    const router: Router = rooms.get(room_id).router;
    const consumerTransport = manageTransports.getTransportById(serverConsumerTransportId);
    if (!consumerTransport) {
      return;
    }

    if (
      router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities,
      })
    ) {
      // transport can now consume and return a consumer
      const consumer = await consumerTransport?.consume({
        producerId: remoteProducerId,
        rtpCapabilities,
        paused: true,
      });

      if (!consumer) {
        return;
      }

      consumer.on("transportclose", () => {
        console.log("transport close from consumer");
      });

      consumer.on("producerclose", () => {
        console.log("producer of consumer closed");
        socket.emit("producer-closed", { remoteProducerId });

        consumerTransport.close();

        manageTransports.removeByTransportId(consumerTransport.id);
        consumer.close();
        consumerManager.removeByConsumerId(consumer.id);
      });

      addConsumer(consumer, room_id, socket.id);

      // from the consumer extract the following params
      // to send back to the Client
      const params = {
        id: consumer.id,
        producerId: remoteProducerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        serverConsumerId: consumer.id,
      };

      // send the parameters to the client
      callback({ params });
    }
  } catch (error: any) {
    callback({
      params: {
        error: error,
      },
    });
    console.log("Error While Getting Media: ", (error as Error).message);
  }
};
