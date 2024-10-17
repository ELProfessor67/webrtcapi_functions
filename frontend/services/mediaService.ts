import { Socket } from "socket.io-client";
import { MUTE_UNMUTE, SCREEN_SHARE } from "@shared/constants/mediasoupEventConstant";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/interfaces/chatSocketInterfaces";



class MediaService {

    async mute(type: 'mic' | 'cam', socketId: string,socket:Socket): Promise<void> {
        await this.emitMuteUnmute(socket,true, type, socketId);
    }

    async unmute(type: 'mic' | 'cam', socketId: string,socket:Socket): Promise<void> {
        await this.emitMuteUnmute(socket,false, type, socketId);
    }

    private async emitMuteUnmute(socket:Socket<ServerToClientEvents, ClientToServerEvents>,value: boolean, type: 'mic' | 'cam', socketId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit(MUTE_UNMUTE, { value, type, socketId });
        });
    }

    async screenShare(type: 'share' | 'unshare',socket:Socket): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.emit(SCREEN_SHARE, { type });
        });
    }
}

export default MediaService;    