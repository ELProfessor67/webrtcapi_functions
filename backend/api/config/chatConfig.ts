import createSockerServer from 'api/processors/socket/createSocketProcessor';
import { Redis } from 'ioredis';
import { JOIN_ROOM, MESSAGE, REDIS_CHANNEL } from '@shared/constants/chatEventsConstant';
import { createRecieveMessageService } from 'api/services/chat/chatService';
import { joinChatRoom } from 'api/processors/chat/joinChatRoomProcessor';
import { messageRecieve } from 'api/processors/chat/receiveMessageProcessor';
import { config } from 'dotenv';
import http from 'http'

config();

export const initChatServer = (httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => {

    const REDIS_SERVER_URL = process.env.REDIS_URL as string;
    if (!REDIS_SERVER_URL) {
        throw new Error('REDIS_URL environment variable is not set');
    }

    const redisPub: Redis = new Redis(REDIS_SERVER_URL);
    const redisSub: Redis = new Redis(REDIS_SERVER_URL);

    redisSub.subscribe(REDIS_CHANNEL);

    const chatSocketServer = new createSockerServer();
    chatSocketServer.io.attach(httpServer);
    const io = chatSocketServer.io;

    createRecieveMessageService(redisSub,redisPub,io);

    io.on('connection',(socket) => {
        console.log('user connect on chat server ',socket.id);
        socket.on(JOIN_ROOM,(argument,callback) => joinChatRoom(argument,callback,socket));
        socket.on(MESSAGE,(argument) => messageRecieve(argument,redisPub,socket));
    })
}

export default initChatServer;