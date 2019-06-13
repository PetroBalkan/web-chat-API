const db = require('../db'),
    {ObjectID} = require('mongodb');

exports.getById = function (id, callback) {
    const collection = db.get().collection('messages');

    try {
        const _id = new ObjectID(id);

        collection.findOne({_id}, function (err, messages) {
            if (err) return callback(err);

            callback(null, messages)
        });
    } catch (error) {
        return callback({status: 404, text: `Message with id ${id} not found`})
    }

};

exports.deleteById = function (id, callback) {
    const collection = db.get().collection('messages');
    try {
        const _id = new ObjectID(id);
        collection.findOneAndDelete({_id}, function (err, result) {
            if (err) return callback(err);

            callback(null, result.value)
        });
    } catch (error) {
        return callback({status: 404, text: `Message with id ${id} not found`})
    }
};

exports.getAll = function (params, callback) {
    const collection = db.get().collection('messages');
    const {skip = 0, take = 10, query} = params;
    const searchParams = query ? {$text: {$search: query}} : {};

    collection
        .find(searchParams)
        .sort({_id: -1})
        .skip(+skip)
        .limit(+take)
        .toArray((error, messages) => {
            callback(null, messages.reverse());
        })
};

exports.saveMessage = function (body, callback) {
    const collection = db.get().collection('messages');
    const messages = Object.assign({}, body, {
        creationDate: new Date().toISOString()
    });
    collection.insertOne(messages, (error, result) => {
        callback(error, result.ops)
    })
};
