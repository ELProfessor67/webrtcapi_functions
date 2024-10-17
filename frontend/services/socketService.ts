import { Socket } from "socket.io-client";
import { MutableRefObject } from "react";
import { io } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/interfaces/chatSocketInterfaces";


class SocketService {
    async initSocket (socketRef:MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents>>){
        io(process.env.NEXT_PUBLIC_SOCKET_URL as string)
    }
}

export default SocketService