function eventHandlerLogger(fn, eventName) {
    return async () => {
        const labelWithTime = `Time taken to handle event ${eventName} ` + Date.now();
        console.time(labelWithTime);
        try {
            const res = await fn()
            console.timeEnd(labelWithTime);
            return res
        } catch (e) {
            console.error(`Exception thrown while handling event ${eventName}  ${e.message}   ${e.type} `)
            console.timeEnd(labelWithTime)
            throw e
        }
    }
}

module.exports = { eventHandlerLogger }
