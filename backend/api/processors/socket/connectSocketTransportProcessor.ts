import * as mediasoup from "mediasoup";
import { Socket } from "socket.io";
import manageTransports from "../webRTC/manageTransportsProcessor";

export const connectSocketTransport = async (
  { dtlsParameters }: { dtlsParameters: mediasoup.types.DtlsParameters },
  socket: Socket
) => {
  try {
    await manageTransports.getTranport(socket.id)?.connect({ dtlsParameters });
  } catch (error) {
    console.log("Getting error while connecting transport: ", (error as Error).message);
  }
};
