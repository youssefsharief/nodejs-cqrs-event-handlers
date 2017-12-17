require('dotenv').config()
const faker = require('faker')
const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
const dbConnection = require('../../src/database/db-connection')
const { dealWithEventSavedInEventStore } = require('../../src/core/event-handler-orchestrator')
const db = require('../../src/database/db-ctrl')
const eventsConstants = require('../../src/config/events.constants')
const generateId = () => faker.random.uuid()
require('../../src/services/winston-logger').configure()

describe("Event handling ", function () {
    beforeAll(async () => {
        dbConnection.connectToTestDb()
    })

    describe("Creating a new account", function () {

        beforeAll(async () => {

        })
        it("should handle create a new account", async function () {
            const accountCreatedEvent = {
                name: eventsConstants.domainEvents.accountCreated,
                aggregateId: generateId(),
            }
            accountCreatedEvent.payload= {
                accountId: accountCreatedEvent.aggregateId,
                accountNumber: 4568,
                businessName: 'YIYJHJG'
            }

            const res = await dealWithEventSavedInEventStore(accountCreatedEvent)
            expect(res.accountId).toBe(accountCreatedEvent.aggregateId)
            expect(res.accountNumber).toBe(accountCreatedEvent.payload.accountNumber)
            expect(res.businessName).toBe(accountCreatedEvent.payload.businessName)
        })

        

    })

    describe("should handle delete account", function () {
        const accountCreatedEvent = {
            name: eventsConstants.domainEvents.accountCreated,
            aggregateId: generateId(),
        }
        accountCreatedEvent.payload= {
            accountId: accountCreatedEvent.aggregateId,
            accountNumber: 4568,
            businessName: 'YIYJHJG'
        }
        
        it("should delete successfully", async function () {
            await dealWithEventSavedInEventStore(accountCreatedEvent)
            const accountDeletedEvent = {
                name: eventsConstants.domainEvents.accountDeleted,
                aggregateId: accountCreatedEvent.aggregateId,
                payload: {  reason: 'YIYJHJG'  }
            }
            const res = await dealWithEventSavedInEventStore(accountDeletedEvent)
            expect(res).toBeTruthy()
            const res2 = await db.getAccountDetailsById(accountCreatedEvent.aggregateId)
            expect(res2).toBeFalsy()
        })

    })



    describe("should handle approve account", function () {
        const accountCreatedEvent = {
            name: eventsConstants.domainEvents.accountCreated,
            aggregateId: generateId(),
        }
        accountCreatedEvent.payload= {
            accountId: accountCreatedEvent.aggregateId,
            accountNumber: 4568,
            businessName: 'YIYJHJG'
        }
        
        it("should handle approve an account", async function () {
            await dealWithEventSavedInEventStore(accountCreatedEvent)
            const accountApprovedEvent = {
                name: eventsConstants.domainEvents.accountApproved,
                aggregateId: accountCreatedEvent.aggregateId,
                payload: {  reason: 'YIYJHJG'  }
            }
            const res = await dealWithEventSavedInEventStore(accountApprovedEvent)
            expect(res).toBeTruthy()
            expect(res.isApproved).toBe(true)
        })
    })


    // describe("should handle reinstate account", function () {
    //     const accountCreatedEvent = {
    //         name: eventsConstants.domainEvents.accountCreated,
    //         aggregateId: generateId(),
    //     }
    //     accountCreatedEvent.payload= {
    //         accountId: accountCreatedEvent.aggregateId,
    //         accountNumber: 4568,
    //         businessName: 'YIYJHJG'
    //     }
        
    //     fit("should handle reinstate an account", async function () {
    //         await dealWithEventSavedInEventStore(accountCreatedEvent)
    //         const accountReinstatedEvent = {
    //             name: eventsConstants.domainEvents.accountDeleted,
    //             aggregateId: accountCreatedEvent.aggregateId,
    //         }
    //         const res = await dealWithEventSavedInEventStore(accountReinstatedEvent)
    //         expect(res).toBeTruthy()
    //     })
    // })


    describe("should handle update account address", function () {
        const accountCreatedEvent = {
            name: eventsConstants.domainEvents.accountCreated,
            aggregateId: generateId(),
        }
        accountCreatedEvent.payload= {
            accountId: accountCreatedEvent.aggregateId,
            accountNumber: 4568,
            businessName: 'YIYJHJG'
        }
        
        it("should update successfully", async function () {
            await dealWithEventSavedInEventStore(accountCreatedEvent)
            const accountAddressUpdatedEvent = {
                name: eventsConstants.domainEvents.accountAddressUpdated,
                aggregateId: accountCreatedEvent.aggregateId,
            }
            accountAddressUpdatedEvent.payload = {
                addressLine1: faker.address.streetAddress(),
                addressLine2: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                postcode: 12135,
                countryName: faker.address.country()
            }
            const res = await dealWithEventSavedInEventStore(accountAddressUpdatedEvent)
            expect(res).toBeTruthy()
            expect(res.addressLine1).toBeTruthy(accountAddressUpdatedEvent.payload.addressLine1)
            expect(res.addressLine2).toBeTruthy(accountAddressUpdatedEvent.payload.addressLine2)
            expect(res.city).toBeTruthy(accountAddressUpdatedEvent.payload.city)
            expect(res.state).toBeTruthy(accountAddressUpdatedEvent.payload.state)
            expect(res.countryName).toBeTruthy(accountAddressUpdatedEvent.payload.countryName)
            expect(res.postcode).toBeTruthy(accountAddressUpdatedEvent.payload.postcode)
        })
    })


})
