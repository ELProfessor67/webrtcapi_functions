import * as mediasoup from "mediasoup";
import * as mediasoupClient from "mediasoup-client";
import { Transport } from "mediasoup-client/lib/types";

export interface IRoomArguments {
  room_id: string;
  username: string;
  isMicMute: boolean;
  isWebCamMute: boolean;
}

export interface ITransportFunctionArguments {
  consumer: boolean;
}

export interface IPramas {
  id?: string;
  iceParameters?: mediasoup.types.IceParameters;
  iceCandidates?: mediasoup.types.IceCandidate[];
  dtlsParameters?: mediasoup.types.DtlsParameters;
  error?: string;
}

export interface IProceTransportAguments {
  kind: mediasoup.types.MediaKind;
  rtpParameters: mediasoup.types.RtpParameters;
  appData: mediasoup.types.AppData;
}

export interface IProducerIds {
  producerId: string;
  socketId: string;
}

export interface IComsumeMediaArgument {
  rtpCapabilities: mediasoup.types.RtpCapabilities;
  remoteProducerId: string;
  serverConsumerTransportId: string;
}

export interface IManageMediaArguments {
  value: boolean;
  type: "mic" | "cam";
  socketId: string;
}

export interface IManageAudioArguments {
  value: boolean;
  type: "mic" | "cam" | "screen";
  socketId: string;
}

export interface IConsumingTransport {
  consumerTransport: Transport;
  serverConsumerTransportId: string;
  producerId: string;
  consumer: mediasoupClient.types.Consumer;
  socketId: string;
}

export interface IProducerData {
  producerId: string;
  socketId: string;
}

export interface IMediaConsumer {
  socketId: string;
  consumer: mediasoup.types.Consumer;
  room_id: string;
}

export interface IMediaProducer {
  socketId: string;
  producer: mediasoup.types.Producer;
  room_id: string;
}

export interface IwebRTCTransport {
  socketId:string
  transport: mediasoup.types.WebRtcTransport
  room_id:string
  consumer: boolean
}