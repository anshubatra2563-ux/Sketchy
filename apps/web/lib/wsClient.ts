let socket : WebSocket | null = null;

export function connect() {
    if(socket &&  socket.readyState === WebSocket.OPEN) {
        return socket;
    }
    socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
        console.log("WebSocket connection established");
    }
    return socket

}