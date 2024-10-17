export const rooms = new Map(); // { roomName1: { Router, rooms: [ sicketId1, ... ] }, ...}
export const peers = new Map(); // { socketId1: { roomName1, socket, transports = [id1, id2,] }, producers = [id1, id2,] }, consumers = [id1, id2,], peerDetails }, ...}
