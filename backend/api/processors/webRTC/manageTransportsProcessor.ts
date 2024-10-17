import { IwebRTCTransport } from '@shared/interfaces/webRTCInterfaces';
import * as mediasoup from 'mediasoup'



const manageTransports = (() => {
    let transports:IwebRTCTransport[] = [];

    const addTransport = (transport:IwebRTCTransport):void => {
        transports.push(transport);
    }

    const remove = (socketId:string):void => {
        transports.forEach((transport:IwebRTCTransport) => {
            if(transport.socketId == socketId){
                transport?.transport?.close();
            }
        })
        transports = transports.filter((transport:IwebRTCTransport) => transport.socketId != socketId);
    }

    const removeByTransportId = (transportId:string):void => {
        transports = transports.filter((transport) => transport.transport.id !== transportId);
    }

    const getTranport = (socketId:string):mediasoup.types.WebRtcTransport | undefined => {
        const transport:IwebRTCTransport | undefined = transports.find((transport:IwebRTCTransport) => transport.socketId == socketId);
        return transport?.transport;
    }


    const getTransportById = (id:string):mediasoup.types.WebRtcTransport | undefined  => {
       const transport:IwebRTCTransport|undefined =  transports.find((transport:IwebRTCTransport) => transport.transport.id == id && transport.consumer);
       return transport?.transport;
    }

    return {
        addTransport,
        remove,
        removeByTransportId,
        getTranport,
        getTransportById,
    }
})();


export default manageTransports;