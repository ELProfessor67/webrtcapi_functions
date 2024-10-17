import { consumers } from "stream";
import WebRTCService from "../services/webrtcService";
import { CONNECT_TRANSPORT, CONSUME, CONSUME_RESUME, CREATE_WEBRTC_TRANSPORT, GET_PRODUCERS, JOIN_ROOM, MUTE_UNMUTE, NEW_PARTCIPANT_JOIN, NEW_PRODUCER, PARTICIPANTS_DISCONNECT, PRODUCE_TRANSPORT, TRANSPORT_RECV_CONNECT } from '@shared/constants/mediasoupEventConstant';
import React, { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from 'mediasoup-client';
import { ClientToServerEvents, IProducerData, ServerToClientEvents } from '@shared/interfaces/chatSocketInterfaces';
import ParticipantService from '../models/participantModel';
import UserMediaService from '../models/mediaModel';
import { Transport } from 'mediasoup-client/lib/types'

export interface IVideoRef {
    [key: string]: HTMLVideoElement
  }
  export interface IAudioRef {
    [key: string]: HTMLAudioElement
  }
  
  export interface IVideoTraks {
    [key: string]: MediaStreamTrack
  }

interface IConsumingTransport {
    consumerTransport: Transport
    serverConsumerTransportId: string
    producerId: string
    consumer: mediasoupClient.types.Consumer,
    socketId: string
}
  
let params = {
    encodings: [
      {
        rid: 'r0',
        maxBitrate: 100000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r1',
        maxBitrate: 300000,
        scalabilityMode: 'S1T3',
      },
      {
        rid: 'r2',
        maxBitrate: 900000,
        scalabilityMode: 'S1T3',
      },
    ],
    codecOptions: {
      videoGoogleStartBitrate: 1000
    }
}

const useManageState = (room_id: string | undefined, username: string,isWebCamMute:boolean,isMicMute:boolean,videoCanvasRef:MutableRefObject<HTMLVideoElement | null>,canvasRef:MutableRefObject<HTMLCanvasElement | null>,isBlur:boolean,isScreenShare:boolean,setSuperForceRender:React.Dispatch<React.SetStateAction<number>>,setPermisstionOpen:Dispatch<SetStateAction<boolean>>,setIsScreenShare:Dispatch<SetStateAction<boolean>>, setSelected:Dispatch<SetStateAction<number>>) => {
    const [socketId, setSocketId] = useState<string | null>(null);
    const [, forceRender] = useState(false);
  
  
  
    const participantsRef = useRef<ParticipantService[]>([]);
    const rtpCapabilitiesRef = useRef<mediasoupClient.types.RtpCapabilities | null>(null);
    const deviceRef = useRef<null | mediasoupClient.types.Device>(null);
    const socketRef = useRef<null | Socket<ServerToClientEvents, ClientToServerEvents>>(null);
    const audioTrackRef = useRef<null | MediaStreamTrack>(null);
    const videoTrackRef = useRef<null | MediaStreamTrack>(null);
    const displayTrackRef = useRef<null | MediaStreamTrack>(null);
    const producerTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
    const audioProducerRef = useRef<null | mediasoupClient.types.Producer>(null);
    const videoProducerRef = useRef<null | mediasoupClient.types.Producer>(null);
    const displayProducerRef = useRef<null | mediasoupClient.types.Producer>(null);
    const audioParamsRef = useRef<any | null>(null);
    const videoParamsRef = useRef<any | null>(null);
    const displayParamsRef = useRef<any | null>(null);
    const consumerTransports = useRef<IConsumingTransport[]>([]);
    const consumingTransports = useRef<string[]>([]);
    const videosElementsRef = useRef<IVideoRef>({});
    const audiosElementRef = useRef<IAudioRef>({});
    const isMicMuteRef = useRef<boolean>(false);
    const isWebCamMuteRef = useRef<boolean>(false);
    const isScreenShareRef = useRef<boolean>(false);
    const socketIdRef = useRef<null | string>(null);
    const usermediaRef = useRef<UserMediaService | null>(null)
    const remoteVideoTracksRef = useRef<IVideoTraks>({});
  
  
  
    //on muted change
    useEffect(() => {
      isMicMuteRef.current = isMicMute;
    },[isMicMute])
  
    useEffect(() => {
      isWebCamMuteRef.current = isWebCamMute;
    },[isWebCamMute])
  
    useEffect(() => {
      isScreenShareRef.current = isScreenShare;
    },[isScreenShare])
  
  
    // on blur change
    useEffect(() => {
     
      if(usermediaRef.current?.segmenter){
        usermediaRef.current?.blurBackground(usermediaRef.current.segmenter, isBlur ? 10 : 0)
      }
    },[isBlur])
  
  
  
  
    function initSocket() {
      if (socketRef.current == null) {
        socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
      }
    }
  
    useEffect(() => {
      initSocket();
    }, []);
  
  
    const connectRecvTransport = useCallback((consumerTransport:mediasoupClient.types.Transport, remoteProducerId:string, serverConsumerTransportId:string, socketId:string) => {
      socketRef.current?.emit(CONSUME,{
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },async ({params}) => {
  
        if (params.error) {
          console.log('Cannot Consume')
          return
        }
    
        console.log(`Consumer Params ${params}`)
  
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters
        })
    
        consumerTransports.current = [
          ...consumerTransports.current,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
            socketId
          },
        ]
        const { track } = consumer;
  
        const participantRef:ParticipantService | undefined = participantsRef.current.find((perticipant:ParticipantService) => perticipant.socketId == socketId);
       
        
  
        if(participantRef){
          if (params.kind == 'audio') {
            
            participantRef.audioTrack = track;
            if(audiosElementRef.current[socketId]){
              audiosElementRef.current[socketId].srcObject = new MediaStream([track])
              audiosElementRef.current[socketId].play().catch(error => {
                console.error('Error attempting to play the media:', error);
              });
            }
          } else {
            console.log('track aaya',track)
            participantRef.videoTrack = track;
            
            if(remoteVideoTracksRef.current[socketId]){
              delete remoteVideoTracksRef.current[socketId];
            }
            remoteVideoTracksRef.current[socketId] = track;
            if(videosElementsRef.current[socketId]){
              videosElementsRef.current[socketId].srcObject = new MediaStream([track])
              videosElementsRef.current[socketId].play().catch(error => {
                console.error('Error attempting to play the media:', error);
              });
            }
            
          }
        }
        console.log('audio',audiosElementRef.current[socketId])
        socketRef.current?.emit(CONSUME_RESUME, { serverConsumerId: params.serverConsumerId });
        setSuperForceRender(Math.random() * 1000);
        forceRender(prev => !prev);
      })
    },[videosElementsRef.current,audiosElementRef.current]);
  
  
    const signalNewConsumerTransport = useCallback(async (remoteProducerId:string,socketId: string) => {
      
      if (consumingTransports.current.includes(remoteProducerId)) return;
      consumingTransports.current.push(remoteProducerId);
  
  
  
      socketRef.current?.emit(CREATE_WEBRTC_TRANSPORT, { consumer: true }, async ({ params }) => {
        if (params.error) {
          console.log(params.error)
          return
        }
  
  
        let consumerTransport;
        try {
          consumerTransport = deviceRef.current?.createRecvTransport(params);
        } catch (error:any) {
          console.log((error as Error).message);
          return
        }
  
        consumerTransport?.on('connect', async ({ dtlsParameters }, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's socket.on('transport-recv-connect', ...)
            await socketRef.current?.emit(TRANSPORT_RECV_CONNECT, {
              dtlsParameters,
              serverConsumerTransportId: params.id,
            })
    
            // Tell the transport that parameters were transmitted.
            callback()
          } catch (error) {
            // Tell the transport that something was wrong
            errback(error as Error)
          }
        })
  
        if(consumerTransport){
          connectRecvTransport(consumerTransport,remoteProducerId,params.id,socketId);
        }
        
      })
    }, [consumingTransports.current])
  
  
  
      const getProducers = useCallback(() => {
        socketRef.current?.emit(GET_PRODUCERS, (producerIds: IProducerData[]) => {
          producerIds.forEach((producerId) => signalNewConsumerTransport(producerId.producerId,producerId.socketId))
          console.log(producerIds,'producersids')
        })
      }, [])
  
  
      const ProduceTrack = useCallback(async (type:string,producererRef:MutableRefObject<null | mediasoupClient.types.Producer>,paramsRef: MutableRefObject<null | any>) => {
        try {
          if (producerTransportRef.current) {
            producererRef.current = await producerTransportRef.current.produce(paramsRef.current);
          }
  
          producererRef.current?.on('trackended', () => {
            console.log('audio track ended')
          })
  
          producererRef.current?.on('transportclose', () => {
            console.log('audio transport ended')
          })
        } catch (error) {
          console.log('Error:',(error as Error).message)
        }
      },[producerTransportRef.current])
  
      const createSendTransport = useCallback(() => {
        socketRef.current?.emit(CREATE_WEBRTC_TRANSPORT, { consumer: false }, async ({ params }) => {
          if (params.error) {
            console.log(params.error)
            return
          }
  
  
          const producerTransport = deviceRef.current?.createSendTransport(params);
          if (producerTransport) {
            producerTransportRef.current = producerTransport;
          }
  
          producerTransportRef.current?.on('connect', async ({ dtlsParameters }, callback, errback) => {
            console.log('transport connect', dtlsParameters)
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socket.on('transport-connect', ...)
              await socketRef.current?.emit(CONNECT_TRANSPORT, {
                dtlsParameters,
              })
              callback();
  
            } catch (error: any) {
              errback(error as Error)
            }
          })
  
          producerTransportRef.current?.on('produce', async (parameters, callback, errback) => {
            console.log(parameters, 'produce perameter');
  
            try {
              socketRef.current?.emit(PRODUCE_TRANSPORT, {
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
                appData: parameters.appData,
              }, ({ id, producersExist }) => {
  
                callback({ id });
                console.log(producersExist, 'producersExist')
                //if (producersExist) getProducers()
              })
            } catch (error) {
              errback(error as Error)
            }
          })
  
          if(videoTrackRef.current){
            ProduceTrack('video',videoProducerRef,videoParamsRef);
          }
  
          if(audioTrackRef.current){
            ProduceTrack('audio',audioProducerRef,audioParamsRef);
          }
  
          
  
        })
      }, [])
  
  
      // functions
      const handleJoin = useCallback(async () => {
  
        socketRef.current?.emit(JOIN_ROOM, { room_id, username,isMicMute:isMicMuteRef.current,isWebCamMute:isWebCamMuteRef.current }, async (socketId: string, rtpCapabilities: mediasoupClient.types.RtpCapabilities, participants: any[]) => {
          setSocketId(socketId);
          socketIdRef.current = socketId;
          rtpCapabilitiesRef.current = rtpCapabilities;
  
  
          console.log(socketId,rtpCapabilities,participants,'jiji')
  
         
  
  
          //create device
          try {
            deviceRef.current = new mediasoupClient.Device();
            await deviceRef.current.load({
              routerRtpCapabilities: rtpCapabilities
            });
            
          } catch (error:any) {
            console.log(error,'device')
            if (error.name === 'UnsupportedError')
              console.warn('browser not supported')
            return
          }
          
  
          //get user media
          const mediaServiceRef = new UserMediaService(videoCanvasRef,canvasRef,isBlur);
          const userMedia = await mediaServiceRef.getUserMedia();
          usermediaRef.current = mediaServiceRef;
  
          videoTrackRef.current = userMedia[0];
          audioTrackRef.current = userMedia[1];
  
          
  
          audioParamsRef.current = { track: audioTrackRef.current };
          videoParamsRef.current = { track: videoTrackRef.current, ...params };
  
          // default mic and cam
          if(isMicMuteRef.current == true && audioTrackRef.current){
            audioTrackRef.current.enabled = false
          }
  
          if(isWebCamMuteRef.current == true && videoTrackRef.current){
            videoTrackRef.current.enabled = false
          }
  
          //add own self in  participants
          const newParticipant: ParticipantService = new ParticipantService(username, socketId,isWebCamMuteRef.current,isMicMuteRef.current, isScreenShareRef.current);
          newParticipant.audioTrack =  audioParamsRef.current;
          newParticipant.videoTrack =  videoParamsRef.current;
  
          participantsRef.current = [...participantsRef.current, newParticipant];
  
          //add others participants
          participants.forEach(participant => {
            const newPartcipant = new ParticipantService(participant.username, participant.socketId,participant.isWebCamMute,participant.isMicMuteRef);
            participantsRef.current = [...participantsRef.current, newPartcipant];
          });
  
          createSendTransport();
          getProducers();
          forceRender((prev) => !prev);
  
        });
      }, [socketRef.current,isMicMuteRef.current,isWebCamMuteRef.current]);
  
  
      const handleMuteUnmute = useCallback(async (value:boolean,type: 'mic' | 'cam') => {
        const participant = participantsRef.current.find((participant: ParticipantService) => participant.socketId == socketIdRef.current);
        if(participant){
          if(type == 'mic'){
            
            participant.isMicMute = value;
  
            //producer audio
            if(!audioTrackRef.current){
              audioTrackRef.current = await usermediaRef.current?.getAudioTrack() as MediaStreamTrack | null;
  
              if(audioTrackRef.current){
                audioParamsRef.current = { track: audioTrackRef.current };
                ProduceTrack('audio',audioProducerRef,audioParamsRef);
              }
            }
  
            if(value && audioTrackRef.current){
              audioTrackRef.current.enabled = false;
            }else if(!value && audioTrackRef.current){
              audioTrackRef.current.enabled = true;
            }
  
          }else{
            participant.isWebCamMute = value;
            participant.isShareScreen = false;
            displayTrackRef.current = null;
  
             //producer audio
             if(!videoTrackRef.current){
                videoTrackRef.current = await usermediaRef.current?.getVideoTrack() as MediaStreamTrack | null;
              }
             
  
            if(videoTrackRef.current){
              videoParamsRef.current = { track: videoTrackRef.current, ...params };
              ProduceTrack('video',videoProducerRef,videoParamsRef);
            }
  
            if(value && videoTrackRef.current){
              videoTrackRef.current.enabled = false;
            }else if(!value && videoTrackRef.current){
              videoTrackRef.current.enabled = true;
            }
          }
        }
        socketRef.current?.emit(MUTE_UNMUTE,{value,type,socketId: socketIdRef.current});
        forceRender(prev => !prev);
        setSuperForceRender(Math.random() * 1000)
      },[socketIdRef.current])
  
  
      const handleScreenShare = useCallback(async (type:'share' | 'unshare') => {
        const participant = participantsRef.current.find((participant: ParticipantService) => participant.socketId == socketIdRef.current); 
        const participantIndex = participantsRef.current.findIndex((participant: ParticipantService) => participant.socketId == socketIdRef.current); 
        if(type == 'share' && usermediaRef.current){
          
          displayTrackRef.current = await usermediaRef.current.getDisplayTrack();
          if(!displayTrackRef.current ){
            setIsScreenShare(false);
            return
          }
  
          displayTrackRef.current.onended = () => handleScreenShare('unshare');
  
          displayParamsRef.current = { track: displayTrackRef.current, ...params };
          ProduceTrack('video',displayProducerRef,displayParamsRef);
          
          if( participant){
            participant.isShareScreen = true;
            participant.isWebCamMute = true;
          }
          socketRef.current?.emit(MUTE_UNMUTE,{value:false,type:'cam',socketId: socketIdRef.current});
          setSelected(participantIndex);
        }else{
  
          displayTrackRef.current = null;
          displayProducerRef.current?.close();
          if( participant){
            participant.isShareScreen = false;
          }
          socketRef.current?.emit(MUTE_UNMUTE,{value:true,type:'cam',socketId: socketIdRef.current});
          setIsScreenShare
          setIsScreenShare(false)
        }
  
        forceRender(prev => !prev);
        setSuperForceRender(Math.random() * 1000);
  
      },[socketIdRef.current,usermediaRef.current]);
  
  
      
  
  
  
  
      // events listners 
      useEffect(() => {
        socketRef.current?.on(NEW_PARTCIPANT_JOIN, ({ socketId, username,isMicMute,isWebCamMute }) => {
          const partcipantExist = participantsRef.current.find((participant: ParticipantService) => participant.socketId == socketId);
          if (partcipantExist) return
  
  
  
  
          const newParticipant: ParticipantService = new ParticipantService(username, socketId,isWebCamMute,isMicMute);
  
          participantsRef.current = [...participantsRef.current, newParticipant];
          forceRender((prev) => !prev);
        });
  
        socketRef.current?.on(PARTICIPANTS_DISCONNECT, ({ socketId }) => {
          participantsRef.current = participantsRef.current?.filter((participant: ParticipantService) => participant.socketId != socketId);
          delete videosElementsRef.current[socketId]
          delete audiosElementRef.current[socketId]
          forceRender((prev) => !prev);
        });
  
  
  
        socketRef.current?.on(NEW_PRODUCER,({producerId,socketId}) => {
          console.log('new producerer',producerId,socketId);
          signalNewConsumerTransport(producerId,socketId);
        })
  
  
  
        socketRef.current?.on(MUTE_UNMUTE,({value,type,socketId}) => {
          console.log(value,type,socketId)
          const participant = participantsRef.current.find((participant: ParticipantService) => participant.socketId == socketId);
          const participantIndex = participantsRef.current.findIndex((participant: ParticipantService) => participant.socketId == socketId);
          const myIndex = participantsRef.current.findIndex((participant: ParticipantService) => participant.socketId == socketIdRef.current);
  
  
          if(participant){
            if(type == 'mic'){
              participant.isMicMute = value;
            }else{
              participant.isWebCamMute = value;
              if(!value){
                setSelected(participantIndex);
              }else{
                setSelected(myIndex);
              }
            }
          }
          forceRender(prev => !prev);
        })
  
  
        return () => {
          socketRef.current?.off(NEW_PARTCIPANT_JOIN);
          socketRef.current?.off(PARTICIPANTS_DISCONNECT);
          socketRef.current?.off(NEW_PRODUCER);
          socketRef.current?.off(MUTE_UNMUTE);
        }
      }, []);
  
      
  
      return (
        { handleJoin, participantsRef,videosElementsRef,audiosElementRef,socketIdRef,videoTrackRef,handleMuteUnmute,remoteVideoTracksRef,handleScreenShare,displayTrackRef}
      )
    }
  
  export default useManageState