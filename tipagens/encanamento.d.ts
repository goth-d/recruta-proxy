export default ImprimeRegistros;
export type RequisiçãoEncanamento = (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, aoTerminar: EncanamentoGerenciadorFinal) => void;
export type EncanamentoGerenciadorFinal = (erro: Error | null) => GerenciadorRequisição;
/**
 * @callback RequisiçãoEncanamento
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {EncanamentoGerenciadorFinal} aoTerminar Executado para completar a requisição no servidor
 * @returns {void}
 */
/**
 * @callback EncanamentoGerenciadorFinal
 * @param {Error?} erro Erro durante a execução da função de encanamento
 * @returns {GerenciadorRequisição} Função principal atribuída às requisições
 */
/**
 * Gera registros das requisições
 * @param {debug.Debugger | Function} depurador Função que imprime uma string, ex: console.log
 * @returns {RequisiçãoEncanamento}
 */
declare function ImprimeRegistros(depurador: debug.Debugger | Function): RequisiçãoEncanamento;
//# sourceMappingURL=encanamento.d.ts.map