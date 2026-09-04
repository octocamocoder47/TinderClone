// Init script run by MongoDB container on first startup
db = db.getSiblingDB('devdb');
db.createCollection('example_collection');
db.example_collection.insertOne({createdAt: new Date(), note: 'initialized'});
