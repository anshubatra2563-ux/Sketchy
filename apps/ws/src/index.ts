import { WebSocketServer } from "ws"
import { joinRoom,BroadcastToRoom,LeaveRoom } from "./room.js"
const PORT = 8080
const wss = new WebSocketServer({ port: PORT })
console.log("Websocket server is running on port", PORT)

wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        const message = JSON.parse(data.toString()) 
        console.log("Received message:", message)
        
        if(message.type === "join") {
            console.log("Joining room", message.roomId)
            joinRoom(message.roomId,socket)
            return
        }

       if (message.type === "create" || message.type === "move" || message.type === "resize" || message.type === "delete") {
            console.log("Broadcasting", message.type, "to room");
            BroadcastToRoom(socket, message)
        }
    })

    socket.on("close", () => {
        LeaveRoom(socket)
        console.log("Client disconnected")
    })
    


})