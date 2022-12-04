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
export function tipoExecucao(arquivoUrl: string): TipoExecucao;
export function obterNomeProxy(): any;
/**
 * Cria um novo cabeçalho purgado pelo proxy.
 * Todas propriedades customizadas são mantidas, assim como algumas propriedades padrões
 * @param {NodeJS.Dict<string | string[]>} reqCabecalhosDic - Dicionário de cabeçalhos http provindo da requisição original
 * @returns {NodeJS.Dict<string | string[]>} Um objeto de cabeçalhos
 */
export function mesclarCabecalhos(reqCabecalhosDic: NodeJS.Dict<string | string[]>): NodeJS.Dict<string | string[]>;
/**
 * @typedef {Object} OpçõesRecruta
 * @property {boolean} [imprimeRegistros=true] Se o proxy imprime os registros dos sockets no console
 * @property {OpçõesServidor} [servidor] Opções adicionais do servidor
 * @property {string} [depuradorString?] Espaço de nome utilizado pelo depurador no console, padrão para nome do app em `ecosystem.config.cjs`
 * @property {boolean} [depuradorOn=true] Se o depurador personalizado deve ser ativado
 */
/**
 * @typedef {Object} OpçõesServidor
 * @property {string} [predefinicaoEnderecoAlvo?] Utilizado quando não definido no cabeçalho `<scheme>://<hostname> | <scheme>://<hostname>:<port>`
 * @property {boolean} [_respostaBinaria=false] Consume a resposta inicial e codifica em `"binary"`, sempre provê o cabeçalho `"Content-Length"`
 */
/** @type {OpçõesRecruta} */
export const OpcoesPredefinidas: OpçõesRecruta;
/** @type {OpçõesServidor} */
export const OpcoesPredefinidasServidor: OpçõesServidor;
export type TipoExecucao = {
    /**
     * Se foi executado pela CLI
     */
    cli: boolean;
    /**
     * Se é um Child Process
     */
    cp: boolean;
};
export type OpçõesRecruta = {
    /**
     * Se o proxy imprime os registros dos sockets no console
     */
    imprimeRegistros?: boolean;
    /**
     * Opções adicionais do servidor
     */
    servidor?: OpçõesServidor;
    /**
     * ?] Espaço de nome utilizado pelo depurador no console, padrão para nome do app em `ecosystem.config.cjs`
     */
    depuradorString?: string;
    /**
     * Se o depurador personalizado deve ser ativado
     */
    depuradorOn?: boolean;
};
export type OpçõesServidor = {
    /**
     * ?] Utilizado quando não definido no cabeçalho `<scheme>://<hostname> | <scheme>://<hostname>:<port>`
     */
    predefinicaoEnderecoAlvo?: string;
    /**
     * Consume a resposta inicial e codifica em `"binary"`, sempre provê o cabeçalho `"Content-Length"`
     */
    _respostaBinaria?: boolean;
};
//# sourceMappingURL=util.d.ts.map