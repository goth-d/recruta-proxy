import Recruta from "./servidor.js";
import ImprimeRegistros from "./encanamento.js";
import { tipoExecucao, OpcoesPredefinidas } from "./util.js";
import debug from "debug";
// saída stdout
debug.log = console.log.bind(console);
import { createServer as criarServidor } from "node:http";

/** @type {number} */
let ProxyPorta = 44;

const Executando = tipoExecucao(import.meta.url);

if (Executando.cli || Executando.cp) RecrutaProxy(Number(process.env.PORT) || undefined);

/**
 * @param {string | URL} [url] URL do endereço alvo da requisição
 * @param {number} [proxyPorta] Porta do endereço proxy, ex: `44`
 * @param {string} [proxyHostname] Hostname do endereço proxy, ex: `localhost`
 * @returns {URL} URL com origem do proxy
 */
export function urlProxy(url, proxyPorta = ProxyPorta, proxyHostname = "localhost") {
	if (url && !(url instanceof URL)) url = new URL(url);
	return new URL(
		url?.toString().slice(url.origin.length) || "",
		`http://${proxyHostname}:${proxyPorta}`
	);
}

/**
 * @typedef {Object} CabeçalhosProxy
 * @property {string} [endereco-alvo] Origem da URL para requisitar apartir do Proxy
 */

/**
 * @param {string | URL} url URL do endereço alvo da requisição
 * @returns {CabeçalhosProxy} Objeto numerável com cabeçalhos
 */
export function cabecalhosProxy(url) {
	if (!(url instanceof URL)) url = new URL(url);
	return { "endereco-alvo": url.origin };
}

/**
 * Função que instancia o servidor proxy
 * @param {number} [porta] Número da porta de escuta do servidor
 * @param {import("./util.js").OpçõesRecruta} [opcoes] Opções adicionais do servidor
 * @returns {import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>} O servidor proxy
 */
export default function RecrutaProxy(porta = ProxyPorta, opcoes) {
	ProxyPorta = porta;
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
		Recruta(opcoes.imprimeRegistros && ImprimeRegistros(depuradorSockets), opcoes.servidor)
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

	if (Executando.cli || Executando.cp) {
		process.on("unhandledRejection", (erro) => {
			throw erro;
		});
		process.on("uncaughtException", (erro) => {
			depurador(
				/*"Kowalski ", */ "Relatório :" + erro.name,
				"\n" + erro.message,
				"\n" + erro.stack
			);
			if (Executando.cp) {
				// pm2 reiniciar
				process.send("ready");
			}
		});
	} else {
		servidor.on("error", (erro) => {
			depurador(
				/*"Kowalski ", */ "Relatório :" + erro.name,
				"\n" + erro.message,
				"\n" + erro.stack
			);
		});
	}

	return servidor;
}
