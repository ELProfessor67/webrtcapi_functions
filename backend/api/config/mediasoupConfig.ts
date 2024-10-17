import http from "http";
import createSockerServer from "../processors/socket/createSocketProcessor";
import {
  CONNECT_TRANSPORT,
  CONSUME,
  CONSUME_RESUME,
  CREATE_WEBRTC_TRANSPORT,
  DISCONNECT,
  GET_PRODUCERS,
  JOIN_ROOM,
  MUTE_UNMUTE,
  PRODUCE_TRANSPORT,
  TRANSPORT_RECV_CONNECT,
} from "@shared/constants/mediasoupEventConstant";
import { joinRoom } from "../processors/room/joinRoomProcessor";
import { consumeMedia } from "../processors/media/consumeMediaProcessor";
import { resumeMedia } from "../processors/media/resumeMediaProcessor";
import { manageMedia } from "../processors/media/manageMediaProcessor";
import { connectSocketTransport } from "../processors/socket/connectSocketTransportProcessor";
import { connectConsumerTransport } from "../processors/webRTC/connectConsumerTransportProcessor";
import { createWebRtcTransport } from "../processors/webRTC/createWebRtcTransportProcessor";
import { getProducer } from "../processors/webRTC/getProducerProcessor";
import { createProducerTransport } from "../processors/webRTC/createProducerTransportProcessor";
import { disconnectParticipant } from "../processors/webRTC/subprocessors/disconnectParticipantProcessor";

export const initMediasoup = (httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {
  const mediaSocketServer = new createSockerServer();
  mediaSocketServer.io.attach(httpServer);
  const io = mediaSocketServer.io;

  io.on("connection", (socket) => {
    console.log("user connect ", socket.id);
    socket.on(JOIN_ROOM, (argument, callback) => joinRoom(argument, callback, socket));
    socket.on(DISCONNECT, () => disconnectParticipant(socket, io));
    socket.on(CREATE_WEBRTC_TRANSPORT, (argument, callback) => createWebRtcTransport(argument, callback, socket));
    socket.on(CONNECT_TRANSPORT, (argument) => connectSocketTransport(argument, socket));
    socket.on(PRODUCE_TRANSPORT, (argument, callback) => createProducerTransport(argument, callback, socket));
    socket.on(GET_PRODUCERS, (callback) => getProducer(callback, socket));
    socket.on(TRANSPORT_RECV_CONNECT, (argument) => connectConsumerTransport(argument));
    socket.on(CONSUME, (argumet, callback) => consumeMedia(argumet, callback, socket));
    socket.on(CONSUME_RESUME, (argument) => resumeMedia(argument));
    socket.on(MUTE_UNMUTE, (argument) => manageMedia(argument, socket));
  });
};

export const WebRTCTransportConfig = {
  iceServers: [
    {
      urls: ["stun.gmx.net:3478", "stun.gradwell.com:3478"],
    },
  ],
};
