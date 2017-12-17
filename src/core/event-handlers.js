const mongodb = require('mongodb')
const db = require('../database/db-ctrl')
const logger = require('../services/logging-event-handler-decorator').eventHandlerLogger
const eventsConstants = require('../config/events.constants')
const eventConstants = require('../config/events.constants')

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
    let events = await db.db('accounts-event-store').collection('events').find({ aggregateId: e.aggregateId })
    events = events.filter(x => x.name !== eventsConstants.domainEvents.accountApproved || x.name !== eventsConstants.domainEvents.accountDeleted || x.name !== eventsConstants.domainEvents.accountReinstated)
    events.forEach(async e => {
        switch (e.name) {
            case eventConstants.domainEvents.accountAddressUpdated: return await handleAccountAddressUpdated(e)
            case eventConstants.domainEvents.systemTagAdded: return await handleSystemTagAdded(e)
            case eventConstants.domainEvents.accountCreated: return await handleAccountCreated(e)
        }
    })
}


module.exports = { handleAccountAddressUpdated, handleAccountApproved, handleAccountDeleted, handleAccountCreated, handleSystemTagAdded, handleAccountReinstated }
