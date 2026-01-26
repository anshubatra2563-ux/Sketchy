import { WebSocketServer } from "ws"

const PORT = 8080
const wss = new WebSocketServer({ port: PORT })

wss.on("connection", (socket) => {
    console.log("Websocket server is running on port", PORT)

    socket.on("message", (data) => {
        const message = data.toString()
        console.log("Received message:", message)

        socket.send(JSON.stringify({
            type : "echo",
            payload : message
        }))
    })

    socket.on("close", () => {
        console.log("Client disconnected")
    })
    


})