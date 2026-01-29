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

export function joinRoom(roomId: string) {
    sendMessage({ type: "joinRoom", roomId });
}

export function onMessage(handler: (message: any) => void) {
    const ws = connect()
    ws.addEventListener("message", (event) => {
        try {
            const data = JSON.parse(event.data)
            handler(data)
        } catch (e) {
            console.error("invalid mesage", e);
        }
    });
}   