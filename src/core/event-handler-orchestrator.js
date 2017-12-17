const { handleAccountAddressUpdated, handleAccountApproved, handleAccountCreated, handleAccountDeleted, handleSystemTagAdded } = require('./event-handlers')
const eventConstants = require('../config/events.constants')



async function dealWithEventSavedInEventStore(e) {
    switch (e.name) {
        case eventConstants.domainEvents.accountAddressUpdated: return await handleAccountAddressUpdated(e)
        case eventConstants.domainEvents.accountApproved: return await handleAccountApproved(e)
        case eventConstants.domainEvents.systemTagAdded: return await handleSystemTagAdded(e)
        case eventConstants.domainEvents.accountDeleted: return await handleAccountDeleted(e)
        case eventConstants.domainEvents.accountCreated: return await handleAccountCreated(e)
        default:
            break;
    }


}

module.exports = { dealWithEventSavedInEventStore }