import { useState, useEffect } from "react";
import Formulario from "./components/updateTeamScore";
import Grafica from "./Grafica";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [equipos, setEquipos] = useState([]);

  // Conectarse al socket y obtener los equipos
  useEffect(() => {
    socket.on("conexionInicial", (equiposActualizados) => {
      setEquipos(equiposActualizados);
    });

    socket.on("puntajeActualizado", (equiposActualizados) => {
      setEquipos(equiposActualizados);
    });

    return () => {
      socket.off("conexionInicial");
      socket.off("puntajeActualizado");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-800 to-zinc-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <Grafica equipos={equipos} />
      <Formulario equipos={equipos} />
    </div>
  );
}

export default App;
