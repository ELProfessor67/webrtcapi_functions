export interface IReciveMessageControllerArguments{
    room_id:string,
    text:string,
    name:string
}

export interface IRedisPublicData {
    room_id: string,
    text: string,
    name: string,
    socketId: string
}