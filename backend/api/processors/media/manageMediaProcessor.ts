import { peers } from "../../constants/variableConstant";
import { Socket } from "socket.io";
import { MUTE_UNMUTE } from "@shared/constants/mediasoupEventConstant";
import { IManageMediaArguments } from "@shared/interfaces/webRTCInterfaces";
import UserModel from "../../model/userModel";

export const manageMedia = async ({ value, type, socketId }: IManageMediaArguments, socket: Socket) => {
  try {
    const peer: UserModel = peers.get(socket.id);
    if (type == "mic") {
      peer.isMicMute = value;
    } else {
      peer.isWebCamMute = value;
    }
    peers.set(socketId, peer);
    const room_id = peer.room_id;
    socket.to(room_id).emit(MUTE_UNMUTE, { value, type, socketId });
  } catch (error) {
    console.log("Getting Error while manage media: ", (error as Error).message);
  }
};
