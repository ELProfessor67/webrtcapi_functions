import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { JOIN_ROOM, LEAVE_ROOM, GET_USER_INFO } from "@shared/constants/mediasoupEventConstant";

class UserService {
    userJoin(socketRef: MutableRefObject<Socket>, room_id: string,username:string,isMicMute:boolean,isWebCamMute:boolean) {
        try {
            socketRef.current.emit(JOIN_ROOM, {room_id,username,isMicMute,isWebCamMute})
            return true;
        } catch (error) {
            return false;
        }
    }

    userLeave(socketRef: MutableRefObject<Socket>, roomId: string) {
        socketRef.current.emit(LEAVE_ROOM, roomId);
    }


    getUserInfo(socketRef: MutableRefObject<Socket>, userId: string): Promise<UserInfo> {
        return new Promise((resolve) => {
            socketRef.current.emit(GET_USER_INFO, userId, (userInfo: UserInfo) => {
                resolve(userInfo);
            });
        });
    }
}

export default UserService;



interface UserInfo {
    id: string;
    name: string;
}