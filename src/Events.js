const listeners = { }
export function emit(type, value) {
    const cbs = listeners[type]
    if (!cbs || cbs.length === 0) {
        return
    }

    for (const cb of cbs) {
        cb(value)
    }
}

export function listen(type, cb) {
    let cbs = listeners[type]
    if (!cbs) {
        listeners[type] = cbs = []
    }

    cbs.push(cb)
}

export function emitBySocket(ws) {
    ws.addEventListener("message", msg => {
        try {
            const parsed = JSON.parse(msg)
            const t = parsed.type
            if (t !== "round.start") {
                return
            }

            if (!Array.isArray(parsed.questions)) {
                throw new Error("malformed round.start")
            }

            emit("round.start", parsed.questions)
        } catch (e) {
        }
    })
}
