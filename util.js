import { Headers } from "undici";
import { resolve as determinar } from "node:path";
import { fileURLToPath as URLEmCaminho } from "node:url";
import { createRequire as criarRequire } from "node:module";
const requerer = criarRequire(import.meta.url);

/**
 * @typedef {Object} OpçõesRecruta
 * @property {boolean} [imprimeRegistros=true] Se o proxy imprime os registros dos sockets no console
 * @property {string} [depuradorString?] Espaço de nome utilizado pelo depurador no console, padrão para nome do app em `ecosystem.config.cjs`
 * @property {boolean} [depuradorOn=true] Se o depurador personalizado deve ser ativado
 */

/** @type {OpçõesRecruta} */
export const OpcoesPredefinidas = {
	imprimeRegistros: true,
	depuradorString: obterNomeProxy(),
	depuradorOn: true,
};

/**
 * @typedef {Object} TipoExecucao
 * @property {boolean} cli Se foi executado pela CLI
 * @property {boolean} cp Se é um Child Process
 */

/**
 * Obtém dados da execução
 * @param {string} arquivoUrl URL do módulo em execução
 * @returns {TipoExecucao} Um objeto
 */
export function tipoExecucao(arquivoUrl) {
	return {
		cli: determinar(process.argv[1]) == determinar(URLEmCaminho(arquivoUrl)),
		cp: !!process.send,
	};
}

export function obterNomeProxy() {
	return requerer("./ecosystem.config.cjs").apps[0].name;
}

/**
 * Remove as propriedades que são, geralmente, recriadas entre cada requisição
 * @param {NodeJS.Dict.<string, string>} cabecalhosDic - Dicionário de cabeçalhos http
 * @returns {NodeJS.Dict.<string, string>} Um novo dicionário
 */
function purgarCabecalhos(cabecalhosDic) {
	const novoCabecalhosDic = {};
	for (const c in cabecalhosDic)
		if (!(c in httpCabecalhosPadroes)) novoCabecalhosDic[c] = cabecalhosDic[c];

	return novoCabecalhosDic;
}

/**
 * Cria um novo cabeçalho purgado pelo proxy.
 * Todas propriedades customizadas são mantidas, assim como algumas propriedades padrões
 * @param {NodeJS.Dict.<string, string>} reqCabecalhosDic - Dicionário de cabeçalhos http provindo da requisição original
 * @returns {NodeJS.Dict.<string, string>} Um objeto de cabeçalhos
 */
export function mesclarCabecalhos(reqCabecalhosDic) {
	const cabecalhosPurgado = purgarCabecalhos(reqCabecalhosDic);
	const cabecalhos = new Headers(cabecalhosPurgado);

	for (const c of proxyCabecalhosPadroesMesclaveis)
		if (c in reqCabecalhosDic) cabecalhos.append(c, reqCabecalhosDic[c]);

	return cabecalhos;
}

/** @type {string[]} */
// modifique isto de acordo a sua precisão
const proxyCabecalhosPadroesMesclaveis = [
	"accept",
	"accept-language",
	// 'accept-patch',
	// 'accept-ranges',
	// 'access-control-allow-credentials',
	// 'access-control-allow-headers',
	// 'access-control-allow-methods',
	// 'access-control-allow-origin',
	// 'access-control-expose-headers',
	// 'access-control-max-age',
	// 'access-control-request-headers',
	// 'access-control-request-method',
	// "age",
	// "allow",
	// 'alt-svc',
	"authorization",
	// 'cache-control',
	// "connection",
	// 'content-disposition',
	"content-encoding",
	"content-language",
	"content-length",
	"content-location",
	// 'content-range',
	"content-type",
	"cookie",
	"date",
	// "etag",
	// "expect",
	// "expires",
	// "forwarded",
	// "from",
	// "host",
	// 'if-match',
	// 'if-modified-since',
	// 'if-none-match',
	// 'if-unmodified-since',
	// 'last-modified',
	// "location",
	// "origin",
	// "pragma",
	// 'proxy-authenticate',
	// 'proxy-authorization',
	// 'public-key-pins',
	// "range",
	// "referer",
	// 'retry-after',
	// 'sec-websocket-accept',
	// 'sec-websocket-extensions',
	// 'sec-websocket-key',
	// 'sec-websocket-protocol',
	// 'sec-websocket-version',
	// 'set-cookie',
	// 'strict-transport-security',
	// "tk",
	// "trailer",
	// 'transfer-encoding',
	// "upgrade",
	"user-agent",
	// "vary",
	// "via",
	// "warning",
	// 'www-authenticate',
];

/** @type {Object.<string, string | string[]>} */
const httpCabecalhosPadroes = Object.create({
	accept: "",
	"accept-language": "",
	"accept-patch": "",
	"accept-ranges": "",
	"access-control-allow-credentials": "",
	"access-control-allow-headers": "",
	"access-control-allow-methods": "",
	"access-control-allow-origin": "",
	"access-control-expose-headers": "",
	"access-control-max-age": "",
	"access-control-request-headers": "",
	"access-control-request-method": "",
	age: "",
	allow: "",
	"alt-svc": "",
	authorization: "",
	"cache-control": "",
	connection: "",
	"content-disposition": "",
	"content-encoding": "",
	"content-language": "",
	"content-length": "",
	"content-location": "",
	"content-range": "",
	"content-type": "",
	cookie: "",
	date: "",
	etag: "",
	expect: "",
	expires: "",
	forwarded: "",
	from: "",
	host: "",
	"if-match": "",
	"if-modified-since": "",
	"if-none-match": "",
	"if-unmodified-since": "",
	"last-modified": "",
	location: "",
	origin: "",
	pragma: "",
	"proxy-authenticate": "",
	"proxy-authorization": "",
	"public-key-pins": "",
	range: "",
	referer: "",
	"retry-after": "",
	"sec-websocket-accept": "",
	"sec-websocket-extensions": "",
	"sec-websocket-key": "",
	"sec-websocket-protocol": "",
	"sec-websocket-version": "",
	"set-cookie": [],
	"strict-transport-security": "",
	tk: "",
	trailer: "",
	"transfer-encoding": "",
	upgrade: "",
	"user-agent": "",
	vary: "",
	via: "",
	warning: "",
	"www-authenticate": "",
});
