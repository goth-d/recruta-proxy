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
  // pm2 inicia
  process.send('ready');
  setTimeout(() => depurador("Servidor proxy na escuta capitão"), 1000);
});

export default RecrutaProxy;

process.on('unhandledRejection', (erro) => {
  throw erro;
})
process.on("uncaughtException", (erro) => {
  depurador(/*"Kowalski ", */"Relatório :" + erro.name, "\n" + erro.message, "\n" + erro.stack);
  // pm2 reinicia
  process.send("ready");
});