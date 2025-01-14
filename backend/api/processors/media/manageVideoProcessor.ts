import { MUTE_UNMUTE } from "@shared/constants/mediasoupEventConstant";
import { IManageAudioArguments } from "@shared/interfaces/webRTCInterfaces";
import { peers } from "api/constants/variableConstant";
import UserModel from "api/model/userModel";
import { Socket } from "socket.io"

export const manageVideo = async  ({value, type, socketId}:IManageAudioArguments,socket:Socket)  => {
    try {
        const peer:UserModel = peers.get(socket.id);
        if(type == 'cam'){
            peer.isMicMute = value;
        }
        peers.set(socketId,peer);
        const room_id = peer.room_id;
        socket.to(room_id).emit(MUTE_UNMUTE,{value,type,socketId});
    } catch (error) {
        console.log('Getting Error while manage media: ',(error as Error).message);
    }
}