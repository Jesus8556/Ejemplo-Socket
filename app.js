const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

// Escucha cambios en el estado desde la API
const apiUrl = 'http://localhost:9000/api/parking';
setInterval(() => {
  axios.get(apiUrl)
    .then((response) => {
      const parkingData = response.data;
      const newState = parkingData[0].estado;

      // Envía el nuevo estado a los clientes conectados
      io.emit('statusChange', newState);
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error.message);
    });
}, 2000); // Actualiza cada 2 segundos (ajusta según sea necesario)

// Configura la conexión Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');
  // Puedes agregar lógica adicional para manejar eventos desde el cliente si es necesario
});

// Inicia el servidor
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
