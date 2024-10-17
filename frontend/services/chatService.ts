import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import { ChatClientToServerEvents, ChatServerToClientEvents } from "@shared/interfaces/chatSocketInterfaces";
import { JOIN_ROOM, MESSAGE } from "@shared/constants/chatEventsConstant";
import { IUserMessage } from "../components/ChatSidebarComponent";


class ChatService {
  initChatSocker(chatSocketRef:MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>,chatSocketIdRef:MutableRefObject<string | null>,room_id:string,name:string){
    if(chatSocketRef.current == null){
      chatSocketRef.current = io(process.env.NEXT_PUBLIC_CHAT_SOCKET_URL as string)
      chatSocketRef.current.emit(JOIN_ROOM,{room_id,name},(id) => {
        chatSocketIdRef.current = id;
      })
    }
  }

  sendMessage(chatSocketRef:MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>,room_id:string,name: string, text: string){
  
    chatSocketRef.current?.emit(MESSAGE,{name,room_id,text})
  }


  onMessage(chatSocketRef: MutableRefObject<Socket<ChatServerToClientEvents, ChatClientToServerEvents> | null>, setMessages: React.Dispatch<React.SetStateAction<IUserMessage[]>>, socketIdRef: MutableRefObject<string | null>) {
    chatSocketRef.current?.on(MESSAGE, ({ message, name, socketId }) => {
      
      const newMessage: IUserMessage = {
        isMe: socketId == socketIdRef.current,
        name,
        socketId,
        message,
        datetime: new Date(Date.now())
      }
      
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage &&
            lastMessage.isMe === newMessage.isMe &&
            lastMessage.name === newMessage.name &&
            lastMessage?.datetime?.getHours() === newMessage?.datetime?.getHours() &&
            lastMessage?.datetime?.getMinutes() === newMessage?.datetime?.getMinutes()) {
          // Merge with the last message
          const updatedLastMessage = {
            ...lastMessage,
            message: `${lastMessage.message}\n${newMessage.message}`
          };
          return [...prev.slice(0, -1), updatedLastMessage];
        } else {
          // Add as a new message
          return [...prev, newMessage];
        }
      });
    });
  }
}

export default ChatService;