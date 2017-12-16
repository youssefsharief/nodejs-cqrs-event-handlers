db.getCollection('accountdetails').ensureIndex({accountId: 1}, {unique: true});
db.getCollection('systemtags').ensureIndex({systemTagId: 1}, {unique: true});

For all models
schema.set('autoIndex', false);
schema.set('autoIndex', false);


This database is idempotent