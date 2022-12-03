import Recruta from "./servidor.js";
import ImprimeRegistros from "./encanamento.js";
import debug from "debug";
// saída stdout
debug.log = console.log.bind(console);
import { createServer as criarServidor, IncomingMessage, Server, ServerResponse } from "node:http";
import { tipoExecucao, OpcoesPredefinidas } from "./util.js";

const Executando = tipoExecucao(import.meta.url);

if (Executando.cli || Executando.cp) RecrutaProxy(Number(process.env.PORT));

/**
 * Função que instancia o servidor proxy
 * @param {number} porta Número da porta de escuta do servidor
 * @param {import("./util.js").OpçõesRecruta} [opcoes?] Opções adicionais do servidor
 * @returns {Server<typeof IncomingMessage, typeof ServerResponse>} O servidor proxy
 */
export default function RecrutaProxy(porta, opcoes = {}) {
	porta = porta || 44;
	opcoes = { ...OpcoesPredefinidas, ...opcoes };
	/** Útil para depurar saídas no console */
	const depurador = opcoes.depuradorOn ? debug(`${opcoes.depuradorString}:${porta}`) : console.log;
	if (opcoes.depuradorOn) depurador.enabled = true;
	/** Saída de registros http */
	const depuradorSockets =
		opcoes.imprimeRegistros && opcoes.depuradorOn ? depurador.extend("sockets") : console.log;
	if (opcoes.imprimeRegistros) depuradorSockets.enabled = true;

	/** A instância do servidor proxy */
	const servidor = criarServidor(
		Recruta(opcoes.imprimeRegistros ? ImprimeRegistros(depuradorSockets) : null)
	);

	servidor.listen(porta, () => {
		if (Executando.cp) {
			// pm2 iniciar
			process.send("ready");
			setTimeout(() => depurador("Servidor proxy na escuta capitão"), 1000);
		} else {
			depurador("Servidor proxy na escuta capitão");
		}
	});

	process.on("unhandledRejection", (erro) => {
		throw erro;
	});
	process.on("uncaughtException", (erro) => {
		depurador(/*"Kowalski ", */ "Relatório :" + erro.name, "\n" + erro.message, "\n" + erro.stack);
		if (Executando.cp) {
			// pm2 reiniciar
			process.send("ready");
		}
	});

	return servidor;
}
