export default Recruta;
export type RequisiçãoGerenciadorFinal = (erro: Error | null) => GerenciadorRequisição;
export type GerenciadorRequisiçãoProxy = (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, gerenciadorErros: RequisiçãoGerenciadorFinal, opcoes?: import("./util.js").OpçõesServidor) => void;
export type GerenciadorRequisição = (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => void;
/**
 * @callback GerenciadorRequisição
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @returns {void}
 */
/**
 * @param {import("./encanamento.js").RequisiçãoEncanamento?} encanamento
 * @param {import("./util.js").OpçõesServidor} [opcoes]
 * @returns {GerenciadorRequisição} Função principal atribuída às requisições
 */
declare function Recruta(encanamento: import("./encanamento.js").RequisiçãoEncanamento | null, opcoes?: import("./util.js").OpçõesServidor): GerenciadorRequisição;
//# sourceMappingURL=servidor.d.ts.map