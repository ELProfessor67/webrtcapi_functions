import { Socket } from "socket.io";
import { peers } from "api/constants/variableConstant";
import { IProducerData } from "@shared/interfaces/webRTCInterfaces";
import producersManager from "./manageProducersProcessor";

export const getProducer = async (callback: (producerIds: IProducerData[]) => void, socket: Socket) => {
  try {
    const room_id = peers.get(socket.id).room_id;
    const producerIds = producersManager.getAllProducersForRoom(room_id, socket.id);
    callback(producerIds);
  } catch (error) {}
};
