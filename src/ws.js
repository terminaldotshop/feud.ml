
export function listenWebSocket(url, callback) {
    console.log("listening to websocket", url)
    const ws = new WebSocket(url)
    ws.onmessage = function(evt) {
        console.log("got message", evt.data)
        try {
            const data = JSON.parse(evt.data)
            callback(data)
        } catch (e) {
        }
    }

    setTimeout(function() {
        console.log("sending")
        ws.send("hello, tj")
    }, 1000);
}
