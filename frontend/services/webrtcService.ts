import { Device } from 'mediasoup-client';

class WebRTCService {
  private device: Device;

  constructor() {
    this.device = new Device();
  }

  async loadDevice(routerRtpCapabilities: any) {
    await this.device.load({ routerRtpCapabilities });
  }

  async createTransport(direction: 'send' | 'recv', transportOptions: any) {
    if (direction === 'send') {
      return  this.device.createSendTransport(transportOptions);
    } else {
      return  this.device.createRecvTransport(transportOptions);
    }
  }


  async consumeMedia(consumer: any, remoteStream: MediaStream) {
    const { track } = await consumer.consume();
    remoteStream.addTrack(track);
    return consumer;
  }

  async produceMedia(producer: any, localStream: MediaStream, kind: 'audio' | 'video') {
    const track = kind === 'audio' ? localStream.getAudioTracks()[0] : localStream.getVideoTracks()[0];
    return await producer.produce({ track });
  }


}

export default WebRTCService;
