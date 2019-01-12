var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function (req, res, next) {
    req.io = io;
    next();
})

app.get('/', (req, res) => {
    let name = req.query['n']
    let age = req.query['a']
    //io.emit('chat message', name);
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg) {
        console.log('message', msg)    
    }
  )});

http.listen(3000, () => {
  console.log('listening on *:3000');
});