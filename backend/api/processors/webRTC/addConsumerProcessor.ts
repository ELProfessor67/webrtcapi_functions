import { peers } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import * as mediasoup from "mediasoup";
import { IMediaConsumer } from "@shared/interfaces/webRTCInterfaces";
import consumerManager from "./manageConsumersProcessor";

export const addConsumer = (consumer: mediasoup.types.Consumer, room_id: string, socketId: string) => {
  const newConsumer: IMediaConsumer = { socketId, consumer, room_id };
  consumerManager.addConsumer(newConsumer);

  const peerRef: UserModel = peers.get(socketId);
  peerRef.consumers = [...peerRef.consumers, consumer.id];
  peers.set(socketId, peerRef);
};
