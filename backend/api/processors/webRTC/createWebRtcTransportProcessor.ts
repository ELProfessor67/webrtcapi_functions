import { Socket } from "socket.io";
import { ITransportFunctionArguments, IPramas } from "@shared/interfaces/webRTCInterfaces";
import { peers, rooms } from "../../constants/variableConstant";
import Room from "../room/manageRoomProcessor";
import { addTransport } from "api/services/webRTC/webRTCService";

export const createWebRtcTransport = async (
  { consumer }: ITransportFunctionArguments,
  callback: (argument: { params: IPramas }) => void,
  socket: Socket
) => {
  try {
    const room_id = peers.get(socket.id).room_id;
    const roomRef: Room = rooms.get(room_id);

    roomRef
      .createWebRtcTransport()
      .then((transport) => {
        callback({
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          },
        });

        addTransport(transport, room_id, consumer, socket.id);
      })
      .catch((error: Error) => {
        callback({
          params: {
            error: error.message,
          },
        });
        console.log("error white creating webrtc transport", error.message);
      });
  } catch (error) {
    console.log("Error While creating Webrtc transport: ", (error as Error).message);
  }
};
