import { Redis } from 'ioredis';
import {REDIS_CHANNEL} from '@shared/constants/chatEventsConstant';
import { IRedisPublicData } from '@shared/interfaces/chatInterfaces';

const publishMessageProcessor = (redispub: Redis, data: IRedisPublicData) => {
    redispub.publish(REDIS_CHANNEL, JSON.stringify(data));
}

export default publishMessageProcessor