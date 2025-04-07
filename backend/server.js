  // server.js
  const express = require('express');
  const http = require('http');
  const { Server } = require('socket.io');
  const cors = require('cors');

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  let equipos = [
    {
      name: 'BrightBloom',
      puntaje: 120,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Glow.png' }
    },
    {
      name: 'SmartPet Solutions',
      puntaje: 134,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Meow.jpg' }
    },  
    {
      name: 'XicoWeb',
      puntaje: 128,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Ixaya.jpeg' }
    },
    {
      name: 'BDMatrix',
      puntaje: 109,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Gym.png' }
    },  
    {
      name: 'Violet',
      puntaje: 135,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Dimen.png' }
    },
    {
      name: 'Xicolab',
      puntaje: 121,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Xicolab.png' }
    },
    {
      name: 'MediTech',
      puntaje: 164,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_PillBox.png' }
    },
    {
      name: 'Virtall',
      puntaje: 124,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_iHome.png' }
    }
    ,
    {
      name: 'DreamStudios',
      puntaje: 122 ,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Iris.png' }
    },
    {
      name: 'SabeRed',
      puntaje: 125,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_Sabores.png' }
    },
    {
      name: 'MedikOS',
      puntaje: 154,
      pictureSettings: { src: 'http://10.10.62.17:3000/images/Logo_MedikOS.jpg' }
    }
  ];


  io.on('connection', (socket) => {
    console.log('Cliente conectado');
  
    // Enviar los equipos al cliente cuando se conecta
    socket.emit('conexionInicial', equipos);
  
    // Actualizar el puntaje de un equipo
    socket.on('actualizarPuntaje', ({ teamIndex, nuevoPuntaje }) => {
      if (equipos[teamIndex]) {
        equipos[teamIndex].puntaje = nuevoPuntaje; // Actualiza el puntaje
        io.emit('puntajeActualizado', equipos); // Emitir los equipos actualizados a todos los clientes
      }
    });
    
    socket.on('resetPuntajes', () => {
      // Restablecer todos los puntajes a cero
      equipos.forEach(equipo => {
        equipo.puntaje = 0;
      });
    
      // Emitir el evento 'puntajeActualizado' para que todos los clientes actualicen la gráfica
      io.emit('puntajeActualizado', equipos);
    })


    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  }); 

  server.listen(4000, () => {
    console.log('Servidor corriendo en http:  //localhost:4000');
  });
