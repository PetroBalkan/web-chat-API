'use strict';
const express = require('express'),
    router = express.Router(),
    Messages = require('../models/messages');

// Views routes

router.get('/', (req, res) => {
    const {query} = req;
    Messages.getAll(query, (err, messages) => {
        res.send(messages)
    })
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    Messages.getById(id, (err, messages) => {
        if (err) {
            return res.status(err.status)
                .send(err.text);
        }
        res.send(messages)
    })
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    Messages.deleteById(id, (err, messages) => {
        if (err) {
            return res.status(err.status)
                .send(err.text);
        }

        res.send(messages)
    })
});

router.post('/', (req, res) => {
    Messages.saveMessage(req.body, (err, message) => {
        if (err) return res.send(err);
        res.send(message);
    })
});

module.exports = router;