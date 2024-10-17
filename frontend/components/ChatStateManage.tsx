import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import { ChatClientToServerEvents,ChatServerToClientEvents } from '@shared/interfaces/chatSocketInterfaces';
import { useCallback, useEffect, useRef, useState } from "react";
import { JOIN_ROOM, MESSAGE } from "@shared/constants/chatEventsConstant";
import { IUserMessage } from "./ChatSidebarComponent";
import ChatService from "../services/chatService";


const useChatStateManage = (name:string,room_id:string,setMessages:React.Dispatch<React.SetStateAction<IUserMessage[]>>) => {
    const chatSocketIdRef = useRef<string | null>(null)
    const chatSocketRef = useRef<null | Socket<ChatServerToClientEvents, ChatClientToServerEvents>>(null);
    const chatService = new ChatService();
  
  
    useEffect(() => {
      chatService.initChatSocker(chatSocketRef,chatSocketIdRef,room_id,name);
    }, [chatService]);
  
    useEffect(() => {
      
      chatService.onMessage(chatSocketRef,setMessages,chatSocketIdRef);
  
      return () => {
        chatSocketRef.current?.off(MESSAGE);
      }
    },[chatSocketRef.current])
  
    const handleMessageSend = useCallback((text:string) => {
      chatService.sendMessage(chatSocketRef,room_id,name,text);
    },[chatSocketRef.current,name,room_id]);
  
    return {handleMessageSend}
  }
  
  export default useChatStateManage