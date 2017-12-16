function eventHandlerLogger(fn, eventHandlerName) {
    
        return async () => {
            console.log(`Start handling event: ${eventHandlerName}`)
            // console.time('time')
            try {
                const res = await fn()
                console.log(res)
                
                // console.timeEnd('time')
                return res
            } catch (e) {
                console.error(`Exception thrown while handling event ${eventHandlerName}  ${e.message}   ${e.type} `)
                // console.timeEnd('time')
                throw e
            }
        }
    }
    
    module.exports = { eventHandlerLogger }
    