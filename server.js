const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware para arquivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Armazenamento simples de mensagens
const messages = [];

// Conexões Socket.io
io.on('connection', (socket) => {
  console.log('Novo usuário conectado');
  
  // Enviar histórico de mensagens
  socket.emit('message history', messages);

  // Receber nova mensagem
  socket.on('chat message', (msg) => {
    const messageObj = {
      user: 'Escola',
      text: msg,
      time: new Date().toLocaleTimeString()
    };
    messages.push(messageObj);
    io.emit('chat message', messageObj); // Broadcast para todos
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

// Configuração da porta
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
