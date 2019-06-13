const express = require('express'),
    bodyParser = require('body-parser'),
    WebSocket = require('ws'),
    app = express(),
    db = require('./db'),
    port = process.env.PORT || 3000,
    dbPort = process.env.MONGODB_URI || 'mongodb://balkanss:petya777@ds125273.mlab.com:25273/',
    dbName = process.env.MONGODB_DB || 'web-chat';
const wss = new WebSocket.Server({port: 8000});

app.set('views', __dirname + '/views');
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('./controllers/index'));

db.connect(dbPort, dbName, (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    } else {
        app.listen(port, function () {
            console.log('Listening on port ' + port);

            wss.broadcast = data => {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                });
            };

            wss.on('connection', ws => {
                ws.on('message', data => {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    });
                });
            });
        });
    }
});

