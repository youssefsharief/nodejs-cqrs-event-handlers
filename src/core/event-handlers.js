const mongodb = require('mongodb')
const db = require('../database/db-ctrl')
const logger = require('../services/logging-event-handler-decorator').eventHandlerLogger
const eventsConstants = require('../config/events.constants')

async function handleAccountAddressUpdated(e) {
    return await logger(async () => await db.updateAccountAddress(e.aggregateId, e.payload),
        eventsConstants.domainEvents.accountAddressUpdated)()
}


async function handleAccountApproved(e) {
    return await logger(async () => await db.approveAccount(e.aggregateId, e.payload.approvedBy),
        eventsConstants.domainEvents.accountApproved)()
}


async function handleAccountCreated(e) {
    return await logger(async () => await db.saveNewAccount(e.aggregateId, e.payload.accountNumber, e.payload.businessName),
        eventsConstants.domainEvents.accountCreated)()
}


async function handleAccountDeleted(e) {
    return await logger(async () => await db.deleteAccount(e.aggregateId),
        eventsConstants.domainEvents.accountDeleted)()
}


async function handleSystemTagAdded(e) {
    return await logger(async () =>
        await db.addSystemTag(e.aggregateId, e.payload.systemTagId,
            e.payload.name, e.payload.appliesToExpenses, e.payload.appliesToTimesheets),
        eventsConstants.domainEvents.systemTagAdded)()
}


async function handleAccountReinstated(e) {
    const db = await mongodb.MongoClient.connect(process.env.mongodbEventStoreURI, { promiseLibrary: Promise }).catch(err => { throw err })
    const collection = await db.db('accounts-event-store').collection('events')
    collection.find({ 'aggregateId': e.aggregateId }).toArray(function(err, events) {
        events = events.filter(x => x.name !== eventsConstants.domainEvents.accountApproved && x.name !== eventsConstants.domainEvents.accountDeleted && x.name !== eventsConstants.domainEvents.accountReinstated)
        const q = handleAccountReinstatedQueue()
        events.forEach(async e => {
            return await q(e)
        })
        
    });
    
}

function handleAccountReinstatedQueue () {
    const arr = []
    return async function enqueue (e) {
        arr.push(e)
        if(arr.length===1) return await recurs()
    }
    async function recurs() {
        await checkForUndoDeleteEvents(arr[0])
        arr.shift()
        if (arr.length) return recurs()
    }
    async function checkForUndoDeleteEvents(e){
        switch (e.name) {
            case eventsConstants.domainEvents.accountAddressUpdated: return await handleAccountAddressUpdated(e)
            case eventsConstants.domainEvents.systemTagAdded: return await handleSystemTagAdded(e)
            case eventsConstants.domainEvents.accountCreated: return await handleAccountCreated(e)
        }
    }
    
}


module.exports = { handleAccountAddressUpdated, handleAccountApproved, handleAccountDeleted, handleAccountCreated, handleSystemTagAdded, handleAccountReinstated }
