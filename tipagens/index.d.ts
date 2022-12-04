/**
 * @param {string | URL} [url] URL do endereço alvo da requisição
 * @param {number} [proxyPorta] Porta do endereço proxy, ex: `44`
 * @param {string} [proxyHostname] Hostname do endereço proxy, ex: `localhost`
 * @returns {URL} URL com origem do proxy
 */
export function urlProxy(url?: string | URL, proxyPorta?: number, proxyHostname?: string): URL;
/**
 * @typedef {Object} CabeçalhosProxy
 * @property {string} [endereco-alvo] Origem da URL para requisitar apartir do Proxy
 */
/**
 * @param {string | URL} url URL do endereço alvo da requisição
 * @returns {CabeçalhosProxy} Objeto numerável com cabeçalhos
 */
export function cabecalhosProxy(url: string | URL): CabeçalhosProxy;
/**
 * Função que instancia o servidor proxy
 * @param {number} [porta] Número da porta de escuta do servidor
 * @param {import("./util.js").OpçõesRecruta} [opcoes] Opções adicionais do servidor
 * @returns {import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>} O servidor proxy
 */
export default function RecrutaProxy(porta?: number, opcoes?: import("./util.js").OpçõesRecruta): import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>;
export type CabeçalhosProxy = {
    /**
     * Origem da URL para requisitar apartir do Proxy
     */
    "endereco-alvo"?: string;
};
//# sourceMappingURL=index.d.ts.map