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


export function BroadcastToRoom(sender: WebSocket, message: any) {
    const roomId = socketToRoom.get(sender)
    if (!roomId) {
        console.log("Sender not in any room");
        return;
    }

    const room = rooms.get(roomId)
    if (!room) {
        console.log("Room not found:", roomId);
        return;
    }
    
    let count = 0;
    for (const socket of room) {
        if (socket !== sender && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
            count++;
        }
    }
    console.log(`Broadcasted to ${count} clients in room ${roomId}`);
}
export function LeaveRoom(socket:WebSocket) {
    const roomId = socketToRoom.get(socket)
    if(!roomId) return;

    const room = rooms.get(roomId)
    if(!room) return;
    
    room.delete(socket)
    socketToRoom.delete(socket)

    if(room.size === 0) {
        rooms.delete(roomId)
    }
}