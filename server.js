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
    console.log(credentials); // Verifique se os dados de login estão sendo recebidos corretamente

    // Lógica de autenticação e verificação de credenciais
    // ...

    // Extrair firstName e lastName do objeto credentials
    const { firstName, lastName } = credentials;

    // Criar um objeto de usuário com firstName e lastName
    const user = {
      firstName,
      lastName
    };

    // Emitir evento 'authenticated' para o cliente com o objeto de usuário completo
    socket.emit('authenticated', { user });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});


server.listen(3000, () => {
  console.log('Servidor Socket.io rodando na porta 3000');
});
