// const eventEmitter = require('events').EventEmitter
const mongodb = require('mongodb')
const dealWithEventSavedInEventStore = require('./event-handler-orchestrator').dealWithEventSavedInEventStore
const currentCursorFs = require('./current-cursor-fs')
const mongoCursorOptions = require('./mongo-cursor-options')

async function poll() {
    let currentCursor = await currentCursorFs.read().catch(err=> {throw err})
    const db = await mongodb.MongoClient.connect(process.env.mongodbEventStoreURI, { promiseLibrary: Promise }).catch(err=> {throw err})
    const collection = await db.db('accounts-event-store').collection('events')
    let query, streamQuery
    if (currentCursor) {
        query = { _id: mongodb.ObjectID(currentCursor) }
    } else {
        query = {}
    }
    const latest = await collection.find(query).sort({ $natural: 1 }).limit(1).nextObject()
    if (currentCursor) {
        streamQuery = { _id: { $gt: latest._id } }
    } else {
        streamQuery = { _id: { $gte: latest._id } }
    }
    const stream = collection.find(streamQuery, mongoCursorOptions).stream()
    
    stream.on('data', async e => {
        return await queue(e)
    })

}





const arr = []
async function queue (e) {
    arr.push(e)
    if(arr.length===1) return await recurs()
}


async function recurs() {
    await dealWithEventSavedInEventStore(arr[0])
    currentCursorFs.write(arr[0]._id)
    arr.shift()
    if (arr.length) return recurs()
}

module.exports = { poll }
