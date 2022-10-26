import Recruta from "./servidor.js";
import ImprimeRegistros from "./encanamento.js";
import debug from "debug";
import { createServer as criarServidor } from "http";

/** @type {number} */
const Porta = Number(process.env.PORT) || 44;

/** Útil para depurar saídas no console */
const depurador = debug("Recruta:" + Porta);
// saída stdout
depurador.log = console.log.bind(console);

/** Saída de registros http */
const depuradorSockets = depurador.extend("sockets");

/** A instância do servidor proxy */
const RecrutaProxy = criarServidor(Recruta(ImprimeRegistros(depuradorSockets)));

RecrutaProxy.listen(Porta, () => {
  depurador("Servidor proxy na escuta capitão");
});

export default RecrutaProxy;

// FIXME: lidar com possível erro de runtime no node e prevenir de finalizar o process
