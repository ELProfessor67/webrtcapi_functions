import { peers } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import * as mediasoup from 'mediasoup';
import manageConsumers from "api/processors/webRTC/manageConsumersProcessor";
import { IMediaConsumer, IwebRTCTransport } from "@shared/interfaces/webRTCInterfaces";
import manageTransports from "api/processors/webRTC/manageTransportsProcessor";


export const addConsumer = (consumer: mediasoup.types.Consumer, room_id: string, socketId: string) => {
        
        const newConsumer: IMediaConsumer = {socketId, consumer , room_id};
       manageConsumers.addConsumer(newConsumer)

        const peerRef: UserModel = peers.get(socketId);
        peerRef.consumers = [...peerRef.consumers, consumer.id]
        peers.set(socketId, peerRef);
}


export const addTransport = (transport: mediasoup.types.WebRtcTransport, room_id: string, consumer: boolean, socketId: string) => {
    // const transportRef: Transport = new Transport(socketId, transport, room_id, consumer);
    const newTransport:IwebRTCTransport = {socketId,transport,room_id,consumer}
    manageTransports.addTransport(newTransport);

    const peerRef: UserModel = peers.get(socketId);
    peerRef.transports = [...peerRef.transports, transport.id]
    peers.set(socketId, peerRef);
}