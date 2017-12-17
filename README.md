1. npm install 
2. npm start





Only if you are going to setup the database you would need to do the following

1. db.getCollection('accountdetails').ensureIndex({accountId: 1}, {unique: true});
2. db.getCollection('systemtags').ensureIndex({systemTagId: 1}, {unique: true});

For all models
schema.set('autoIndex', false);
schema.set('autoIndex', false);


This database is idempotent