Only if you are going to setup the database you would need to perform the following commands for the Mongodb database

* `db.getCollection('accountdetails').ensureIndex({accountId: 1}, {unique: true});`
* `db.getCollection('systemtags').ensureIndex({systemTagId: 1}, {unique: true});`

For all models
* `schema.set('autoIndex', false);`
* `schema.set('autoIndex', false);`


All operations on this database are idempotent
