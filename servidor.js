import { IncomingMessage, ServerResponse } from "http";
import { request as requisicao } from "undici";
import { mesclarCabecalhos } from "./util.js";
import gerenciadorFinal from "finalhandler";
import criarErro from "http-errors";

/**
  * @callback GerenciadorRequisição
  * @param {IncomingMessage} req 
  * @param {ServerResponse} res 
  * @returns {void}
  */

/**
 * @callback GerenciadorFinal
 * @param {Error?} erro
 * @returns {void}
 */

/**
  * @callback RequisiçãoEncanamento
  * @param {IncomingMessage} req 
  * @param {ServerResponse} res 
  * @param {GerenciadorFinal} terminado Executado após ser aplicada esta função
  * @returns {void}
  */

/**
  * @callback GerenciadorRequisiçãoProxy
  * @param {IncomingMessage} req 
  * @param {ServerResponse} res 
  * @param {GerenciadorFinal} gerenciadorErros Executado caso for preciso abortar a requisição
  * @returns {void}
  */


/**
 * @param {RequisiçãoEncanamento?} encanamento
 * @returns {GerenciadorRequisição} Função principal atribuída às requisições
 */
const Recruta = (encanamento) => {

  /** @type {GerenciadorRequisição} */
  const gerenciadorRequisição = encanamento ?
    (req, res) => {
      /** @type {GerenciadorFinal} */
      const responderErro = gerenciadorFinal(req, res);

      encanamento(req, res, (erro) => {
        if (erro) return responderErro(erro);

        lidarComRequisicao(req, res, responderErro);
      })

    } :
    (req, res) => {
      /** @type {GerenciadorFinal} */
      const responderErro = gerenciadorFinal(req, res);

      lidarComRequisicao(req, res, responderErro);
    }

  return gerenciadorRequisição;
}


/** @type {GerenciadorRequisiçãoProxy} */
function lidarComRequisicao(req, res, gerenciadorErros) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", req.headers['access-control-request-headers'] || "");

  if (req.method == "OPTIONS") {
    // cors preflight
    res.statusCode = 200;
    return res.write("");
  } else {

    let endereco = req.headers["endereco-alvo"]; // endereco alvo url <scheme>://<hostname> | <scheme>://<hostname>:<port>
    if (!endereco) {

      return gerenciadorErros(criarErro(400, "Não há um endereço no cabeçalho da requisição, defina 'endereco-alvo' com o endereço [<scheme>://<hostname> | <scheme>://<hostname>:<port>] a ser requisitado"));
    } else {

      if (Array.isArray(endereco)) endereco = endereco[0];
      delete req.headers["endereco-alvo"];
    }

    // modifica req url para obter endereço completo no morgan
    req.url = endereco + req.url;
    requisicao(req.url, { method: req.method, body: req.body, headers: mesclarCabecalhos(req.headers) })
      .then(async (alvoRes) => {
        // erro de CORS ainda pode ser retornado se a política anti-script do alvo não permitir requisições desta origem

        // abordagem comum, caso 'content-length' não esteja especificado os navegadores atribuem o tamanho ao final
        res.writeHead(alvoRes.statusCode, alvoRes.headers);
        alvoRes.body.pipe(res);

        // abordagem adaptada para prover 'content-length' cabeçalho independente do '.statusCode'
        // - esta abordagem soma tempo de resposta ao proxy
        /* alvoRes.body.arrayBuffer()
        .then((buff) => {
          alvoRes.headers["Content-Length"] = Buffer.byteLength(buff, alvoRes.body.readableEncoding);
          res.writeHead(alvoRes.statusCode, alvoRes.headers);
          res.write(buff, "binary");
          res.end(null, "binary");
        }) */
      })
      .catch(gerenciadorErros)
  }
}

export default Recruta;