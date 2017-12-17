const accountModel = require('./models/account-details.model')
const systemTagModel = require('./models/system-tag.model')

async function saveNewAccount(accountId, accountNumber, businessName) {
    const newAccount = new accountModel({ accountId, accountNumber, businessName })
    return await newAccount.save().catch(err => console.log(err.message))
}

async function addSystemTag(accountId, systemTagId, name, appliesToExpenses, appliesToTimesheets) {
    const newSystemTag = new systemTagModel({ accountId, systemTagId, name, appliesToExpenses, appliesToTimesheets })
    return newSystemTag.save().catch(err => console.log(err.message))
}


async function deleteAccount(accountId) {
    await Promise.all([accountModel.remove({ accountId }).exec(), systemTagModel.remove({accountId}).exec().catch(err=>console.log(err))]).catch(err => console.log(err.message))
}



async function updateAccountAddress(accountId, { addressLine1, addressLine2, city, postcode, state, countryName }) {
    return await accountModel.findOneAndUpdate({ accountId }, { $set: { addressLine1, addressLine2, city, postcode, state, countryName } }, { new: true }).exec()
        .catch(err => console.log(err.message))
}



async function approveAccount(accountId, approvedBy) {
    return await accountModel.findOneAndUpdate({ accountId }, { $set: { approvedBy, isApproved: true } }, { new: true }).exec().catch(err => console.log(err.message))
}

// For testing purposes only
async function getAccountDetailsById(accountId) {
    return await accountModel.findOne({ accountId }).lean().exec().catch(err => console.log(err.message))
}

module.exports = {
    saveNewAccount, addSystemTag, deleteAccount, updateAccountAddress, approveAccount, getAccountDetailsById
}