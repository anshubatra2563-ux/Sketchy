let socket: WebSocket | null = null;

export function connect() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }
    socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
        console.log("WebSocket connection established");
    }
    return socket

}

export function sendMessage(message: any) {
    const ws = connect()
    const payload = JSON.stringify(message);

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
        return
    }
    ws.addEventListener(
        "open",
        () => {
            ws.send(payload);
        },
        { once: true }
    );
}