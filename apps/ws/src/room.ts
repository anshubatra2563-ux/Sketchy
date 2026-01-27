import { WebSocket } from "ws";
export type RoomId = string;

const rooms = new Map<RoomId ,Set<WebSocket>>()

const socketToRoom = new Map<WebSocket ,RoomId>()

export function joinRoom(roomId:RoomId,socket:WebSocket) {
    let room = rooms.get(roomId)
    
    if(!room) {
        room = new Set<WebSocket>()
        rooms.set(roomId,room)
    }
    room.add(socket)
    socketToRoom.set(socket,roomId)
    console.log(roomId)
    console.log(`socket joined room ${roomId} Total users:${room.size}`)
}


export function BroadcastToRoom(sender:WebSocket,message:any) {
   const roomId = socketToRoom.get(sender)
   if(!roomId) return;

   const room  = rooms.get(roomId)
   for(const socket of room!) {
    if(socket !== sender) {
        socket.send(JSON.stringify(message))
    }
   }    
}