let socket: WebSocket | null = null;
let currentRoomId: string | null = null;
let messageHandler: ((message: any) => void) | null = null;

export function connect() {
    // If socket exists and is open OR connecting, return it
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return socket;
    }
    
    console.log("Creating new WebSocket connection");
    socket = new WebSocket("ws://localhost:8080");
    
    socket.onopen = () => {
        console.log("WebSocket connection established");
        // Re-join room if we were in one
        if (currentRoomId) {
            console.log("Re-joining room:", currentRoomId);
            const payload = JSON.stringify({ type: "join", roomId: currentRoomId });
            socket!.send(payload);
        }
    }
    
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    }
    
    socket.onclose = () => {
        console.log("WebSocket closed");
        socket = null;
        // Don't reset currentRoomId - will rejoin on reconnect
    }
    
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (messageHandler) {
                messageHandler(data);
            }
        } catch (e) {
            console.error("Invalid message", e);
        }
    };
    
    return socket;
}

export function sendMessage(message: any) {
    const ws = connect();
    const payload = JSON.stringify(message);

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
        console.log("Sent:", message.type);
        return;
    }
    
    if (ws.readyState === WebSocket.CONNECTING) {
        console.log("Waiting for connection to open");
        ws.addEventListener(
            "open",
            () => {
                ws.send(payload);
                console.log("Sent (after wait):", message.type);
            },
            { once: true }
        );
    }
}

export function joinRoom(roomId: string) {
    console.log("Joining room:", roomId);
    currentRoomId = roomId;
    sendMessage({ type: "join", roomId });
}

export function onMessage(handler: (message: any) => void) {
    messageHandler = handler;
    connect();
}