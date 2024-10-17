import { MESSAGE, REDIS_CHANNEL } from "@shared/constants/chatEventsConstant.js";
import { sendMessageProcessor } from "../../processors/chat/sendMessageProcessor";
import {Redis} from 'ioredis'
import {Server,DefaultEventsMap} from 'socket.io'

export const createRecieveMessageService = (redissub:Redis,redispub:Redis,io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    redissub.on('message', (channel:string, message:string) => {
        if (channel === REDIS_CHANNEL) {
            sendMessageProcessor(message,io);
        }
    });

    // Optional error handling
    redissub.on('error', (err:any) => {
        console.error('Redis subscriber error:', err);
    });

    redispub.on('error', (err:any) => {
        console.error('Redis publisher error:', err);
    });
}