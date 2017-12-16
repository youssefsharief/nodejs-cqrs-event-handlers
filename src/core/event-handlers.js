const db = require('../database/db-ctrl')
const logger = require('../services/logging-event-handler-decorator').eventHandlerLogger

async function handleAccountAddressUpdated(body){
    console.log('updatign afddress')
    
    await db.updateAccountAddress(body.aggregateId, body.payload.addressLine1, body.payload.addressLine1,
        body.payload.addressLine2, body.payload.city, body.payload.postcode,
        body.payload.state, body.payload.countryName)
}


async function handleAccountApproved(body){
    console.log('approving')
    await db.approveAccount(body.aggregateId, body.payload.approvedBy)
}


async function handleAccountCreated(body){
    console.log('creating')

    
    await db.saveNewAccount(body.aggregateId, body.payload.accountNumber, body.payload.businessName)
}


async function handleAccountDeleted(body){
    console.log('deletinggg')
    
    await db.deleteAccount(body.aggregateId)
}


async function handleSystemTagAdded(body){
    console.log('adding systag')
    const obj = {}
    return logger(async () => db.addSystemTag(body.aggregateId, body.payload.systemTagId, body.payload.name, body.payload.appliesToExpenses, body.payload.appliesToTimesheets), 'system tag added')()
}

module.exports = {handleAccountAddressUpdated,  handleAccountApproved, handleAccountDeleted, handleAccountCreated, handleSystemTagAdded}
