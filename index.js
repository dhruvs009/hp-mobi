var express = require('express');
const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function (req, res, next) {
    req.io = io;
    next();
})

app.use(express.static('public'))

var players =  {player0: null, player1: null}

app.get('/', (req, res) => {
    //io.emit('chat message', name);
    res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/game.html')
})

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/temp.html')
})

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    var userId;
    socket.emit('newUser', socket.id)
    socket.on('connectMe', function() {
        if (players['player0'] != null && players['player1'] != null) {
            userId = socket.id
            socket.emit('roomFull', "Apologies Room Is Full!")
        }
        else {
            userId = socket.id
            if (players['player0'] == null) {
                players['player0'] = userId
            } else {
                players['player1'] = userId
            }
            console.log(players)
        }
    })

    socket.on('getUsers', function(data) {
        socket.emit('recieveUsers', {players: players})
    }) 
    socket.on('disconnect', function(){
        //players.splice(players.indexOf(socket.id), 1)
        if (players['player0'] == userId) {
            players['player0'] = null
        }
        else {
            players['player1'] = null
        }
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
        if (msg != 'back to normal') socket.send(msg)    
    });
    socket.on('spells', function(data) {
        console.log("Recieved: ", data)
        target = null;
        Object.keys(players).forEach(function(key, index) {
            if (players[key] == userId) {
                target = index
            }    
        })
        console.log(target)
        socket.broadcast.emit('move', {
            "spell": data['spell'],
            //"user": players.indexOf(data['user'])
            "user": target
        })
    })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});