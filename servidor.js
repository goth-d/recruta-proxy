import { IncomingMessage, ServerResponse } from "node:http";
import { request as requisicao } from "undici";
import { mesclarCabecalhos, OpcoesPredefinidasServidor } from "./util.js";
import requisicaoGerenciadorFinal from "finalhandler";
import criarErro from "http-errors";

/**
 * @callback GerenciadorRequisição
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @returns {void}
 */

/**
 * @param {import("./encanamento.js").RequisiçãoEncanamento?} encanamento
 * @param {import("./util.js").OpçõesServidor} [opcoes]
 * @returns {GerenciadorRequisição} Função principal atribuída às requisições
 */
const Recruta = (encanamento, opcoes) => {
	opcoes = { ...OpcoesPredefinidasServidor, ...opcoes };

	/** @type {GerenciadorRequisição} */
	const gerenciadorRequisição = encanamento
		? (req, res) => {
				/** @type {RequisiçãoGerenciadorFinal} */
				const gerenciadorErros = requisicaoGerenciadorFinal(req, res);

				encanamento(req, res, (erro) => {
					if (erro) return gerenciadorErros(erro);

					lidarComRequisicao(req, res, gerenciadorErros, opcoes);
				});
		  }
		: (req, res) => {
				/** @type {RequisiçãoGerenciadorFinal} */
				const responderErro = requisicaoGerenciadorFinal(req, res);

				lidarComRequisicao(req, res, responderErro, opcoes);
		  };

	return gerenciadorRequisição;
};

/**
 * @callback RequisiçãoGerenciadorFinal
 * @param {Error?} erro Erro durante a execução da função principal de requisições
 * @returns {GerenciadorRequisição} Função principal atribuída às requisições
 */

/**
 * @callback GerenciadorRequisiçãoProxy
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {RequisiçãoGerenciadorFinal} gerenciadorErros Executado caso for preciso abortar a requisição
 * @param {import("./util.js").OpçõesServidor} [opcoes]
 * @returns {void}
 */

/** @type {GerenciadorRequisiçãoProxy} */
function lidarComRequisicao(req, res, gerenciadorErros, opcoes) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		req.headers["access-control-request-headers"] || ""
	);

	if (req.method == "OPTIONS") {
		// cors preflight
		res.statusCode = 200;
		return res.write("");
	} else {
		let endereco = req.headers["endereco-alvo"] || opcoes.predefinicaoEnderecoAlvo;

		if (!endereco) {
			return gerenciadorErros(
				criarErro(
					400,
					"Não há um endereço no cabeçalho da requisição, defina 'endereco-alvo' com o endereço [<scheme>://<hostname> | <scheme>://<hostname>:<port>] a ser requisitado"
				)
			);
		} else if (headers["endereco-alvo"]) {
			// lida com a propriedade do cabeçalho
			if (Array.isArray(endereco)) endereco = endereco[0];
			delete req.headers["endereco-alvo"];
		}

		// reatribui sockets req.url para saida no depurador
		req.url = new URL(req.url, endereco);
		requisicao(req.url, {
			method: req.method,
			body: req.body,
			headers: mesclarCabecalhos(req.headers),
		})
			.then(async (alvoRes) => {
				// erro de CORS ainda pode ser retornado se a política anti-script do alvo não permitir requisições desta origem

				if (!opcoes._respostaBinaria) {
					// abordagem comum, responde com mesma codificação
					// caso 'content-length' não esteja especificado os navegadores atribuem o tamanho ao final
					res.writeHead(alvoRes.statusCode, alvoRes.headers);
					alvoRes.body.pipe(res);
				} else {
					// responde em binário, adaptado para prover 'content-length' cabeçalho independente do '.statusCode'
					// - soma outro tempo de resposta ao proxy
					alvoRes.body.arrayBuffer().then((buff) => {
						alvoRes.headers["Content-Length"] = Buffer.byteLength(
							buff,
							alvoRes.body.readableEncoding
						);
						res.writeHead(alvoRes.statusCode, alvoRes.headers);
						res.write(buff, "binary");
						res.end(null, "binary");
					});
				}
			})
			.catch(gerenciadorErros);
	}
}

export default Recruta;
