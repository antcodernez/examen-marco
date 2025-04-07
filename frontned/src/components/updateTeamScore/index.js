import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import "./style.css";

const socket = io("http://localhost:4000");

const Formulario = ({ equipos }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [puntaje, setPuntaje] = useState('');

  // Establecer el equipo seleccionado por defecto
  useEffect(() => {
    if (equipos.length > 0) {
      setSelectedTeam(equipos[0].name); // Establecer el primer equipo como predeterminado
    }
  }, [equipos]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Encontrar el índice del equipo seleccionado
    const teamIndex = equipos.findIndex((equipo) => equipo.name === selectedTeam);

    // Asegurarse de que el índice sea válido y el puntaje esté ingresado
    if (teamIndex >= 0 && puntaje !== '') {
      socket.emit('actualizarPuntaje', { teamIndex, nuevoPuntaje: puntaje });
    }
  };

  const handleReset = () => {
    socket.emit('resetPuntajes');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white mb-4">Actualizar Puntaje</h2>
      <div className="mb-4">
        <label className="block text-white">Selecciona el equipo</label>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          {equipos.map((equipo, index) => (
            <option key={index} value={equipo.name}>
              {equipo.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-white">Nuevo Puntaje</label>
        <input
          type="number"
          value={puntaje}
          onChange={(e) => setPuntaje(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
          min="0"
        />
      </div>
      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg">Actualizar Puntaje</button>

      <button
        type="button"
        onClick={handleReset}
        className="w-full mt-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Restablecer Puntajes
      </button>
    </form>
  );
};

export default Formulario;
