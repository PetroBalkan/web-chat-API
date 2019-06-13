const express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    FileStorage = require('../models/files'),

    multer = require('multer'),
    maxFileSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/files/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage,
    fileFilter: function fileFilter(req, file, cb) {
        if (/image\//.test(file.mimetype)) {
            cb(null, true)
        } else {
            req.fileNotValidError = `File type ${file.mimetype} not allowed!`;
            cb(null, false)
        }
    },
    limits: {fileSize: maxFileSize}
}).single('file');


router.post('/', function (req, res) {
    upload(req, res, function (error) {
        if (req.fileNotValidError) {
            return res.end(req.fileNotValidError);
        }

        if (error) {
            return res.send(error)
        }

        const {file} = req;
        FileStorage.saveFile(file, (err, result) => {
            if (err)
                return res.send(err);
            res.send(result)
        })
    })
});

router.get('/', function (req, res) {
    res.render('files/upload')
});

router.get('/all', function (req, res) {
    FileStorage.getFiles(req.query, function (err, files) {
        if (err) return res.send(err);
        res.render('files/list', files)
    })
});

router.get('/:id', function (req, res) {
    FileStorage.getFile(req.params.id, function (err, file) {
        if (err) {
            return res.status(err.status)
                .send(err.text);
        }
        res.send(file)
    })
});

router.delete('/:id', function (req, res) {
    FileStorage.deleteFile(req.params.id, function (err, file) {

        if (err) {
            return res.status(err.status)
                      .send(err.text);
        }

        try {
            fs.unlink(file.path, function (er) {
                if (er) return console.log(er);
                res.send(file)
            });
        } catch (error) {
            console.log(error);
        }
    })
});

module.exports = router;
