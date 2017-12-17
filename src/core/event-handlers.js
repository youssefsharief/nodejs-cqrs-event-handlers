const db = require('../database/db-ctrl')
const logger = require('../services/logging-event-handler-decorator').eventHandlerLogger
const eventsConstants = require('../config/events.constants')
async function handleAccountAddressUpdated(e) {
    console.log('updatign afddress')
    return await logger(async () => await db.updateAccountAddress(e.aggregateId, e.payload.addressLine1, e.payload.addressLine1,
        e.payload.addressLine2, e.payload.city, e.payload.postcode, e.payload.state, e.payload.countryName),
        eventsConstants.domainEvents.accountAddressUpdated)()
}


async function handleAccountApproved(e) {
    console.log('approving')
    return await logger(async () => await db.approveAccount(e.aggregateId, e.payload.approvedBy),
        eventsConstants.domainEvents.accountApproved)()
}


async function handleAccountCreated(e) {
    console.log('creating')
    return await logger(async () => await db.saveNewAccount(e.aggregateId, e.payload.accountNumber, e.payload.businessName),
        eventsConstants.domainEvents.accountCreated)()
}


async function handleAccountDeleted(e) {
    console.log('deletinggg')
    return await logger(async () => await db.deleteAccount(e.aggregateId),
        eventsConstants.domainEvents.accountDeleted)()
}


async function handleSystemTagAdded(e) {
    console.log('adding systag')
    return await logger(async () =>
        await db.addSystemTag(e.aggregateId, e.payload.systemTagId,
            e.payload.name, e.payload.appliesToExpenses, e.payload.appliesToTimesheets),
        eventsConstants.domainEvents.systemTagAdded)()
}

module.exports = { handleAccountAddressUpdated, handleAccountApproved, handleAccountDeleted, handleAccountCreated, handleSystemTagAdded }
