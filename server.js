const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar o middleware do CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('login', (credentials) => {
    console.log(credentials); 

 
    const { firstName, lastName } = credentials;

    const user = {
      firstName,
      lastName
    };

    socket.emit('authenticated', { user });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(3000, () => {
  console.log('Servidor Socket.io rodando na porta 3000');
});
