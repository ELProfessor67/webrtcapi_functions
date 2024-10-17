import { Socket } from "socket.io";
import { peers, rooms } from "api/constants/variableConstant";
import { Server } from "socket.io";
import RoomService from "../../room/manageRoomProcessor";
import { PARTICIPANTS_DISCONNECT } from "@shared/constants/mediasoupEventConstant";
import consumerManager from "../manageConsumersProcessor";
import producerManager from "../manageProducersProcessor";
import manageTransports from "../manageTransportsProcessor";

export const disconnectParticipant = async (socket: Socket, connection: Server) => {
  try {
    const room_id = peers.get(socket.id)?.room_id;
    peers.delete(socket.id);

    manageTransports.remove(socket.id);
    producerManager.removeProducerBySocketId(socket.id);
    consumerManager.removeBySocketId(socket.id);

    const roomRef: RoomService = rooms.get(room_id);
    if (roomRef?.participants) {
      roomRef.participants = roomRef.participants.filter((socketId) => socketId != socket.id);
    }
    rooms.set(room_id, roomRef);
    connection.to(room_id).emit(PARTICIPANTS_DISCONNECT, { socketId: socket.id });
  } catch (error) {
    console.log("Error while user disconnet: ", (error as Error).message);
  }
};
