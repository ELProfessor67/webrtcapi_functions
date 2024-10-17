import { MESSAGE } from "@shared/constants/chatEventsConstant";
import { Server } from "socket.io";

export const sendMessageProcessor = (message:string, io:Server) => {
    const { room_id, text, name, socketId } = JSON.parse(message);
    console.log(room_id, text, name, socketId)
    io.to(room_id).emit(MESSAGE, { message: text, name, socketId });
}