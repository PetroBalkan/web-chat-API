const db = require('../db'),
    {ObjectID} = require('mongodb');

exports.saveFile = function (file, callback) {
    const collection = db.get().collection('files');

    const data = {
        originalName: file.originalname,
        path: file.path,
        fileName: file.filename
    };
    collection.insertOne(data, (error, result) => {
        callback(error, result.ops)
    });
};

exports.getFiles = function (params, callback) {
    const collection = db.get().collection('files');
    const {skip = 0, take = 10} = params;

    collection.find().skip(+skip).limit(+take).toArray((error, files) => {
        if (error) return callback(error);
        callback(null, {files});
    });
};

exports.getFile = function (id, callback) {
    const collection = db.get().collection('files');

    try {
        const _id = new ObjectID(id);

        collection.findOne({_id}, function (err, file) {
            if (err) return callback(err);
            callback(null, file)
        });
    } catch (error) {
        return callback({status: 404, text: `File with id ${id} not found`})
    }
};

exports.deleteFile = function (id, callback) {
    const collection = db.get().collection('files');

    try {
        const _id = new ObjectID(id);
        collection.findOneAndDelete({_id}, function (err, result) {
            if (err) return callback(err);
            callback(null, result.value);
        });
    } catch (error) {
        return callback({status: 404, text: `File with id ${id} not found`})
    }
};