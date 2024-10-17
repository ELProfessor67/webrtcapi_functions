import { Socket } from "socket.io";

export const joinChatRoom = async ({room_id,name}:{room_id:string,name:string},callback:(id:string) => void,socket:Socket) => {
    try {
        socket.join(room_id)
        callback(socket.id);
    } catch (error) {
        console.log('Error white joining chat room',(error as Error).message);
    }
}

