const {MongoClient} = require('mongodb');

const state = {db: null};

exports.connect = (url, dbName, done) => {
    if (state.db) return done();
    MongoClient.connect(url + dbName, {useNewUrlParser: true}, (error, client) => {
        if (error) return done(error);
        state.db = client.db(dbName);
        done();
    });
};

exports.get = () => {
    return state.db;
};

exports.close = (done) => {
    if (state.db) {
        state.db.close((error) => {
            state.db = null;
            state.mode = null;
            done(error)
        })
    }
};
