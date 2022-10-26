import { createServer as criarServidor } from "http";
import { request as requisicao } from "undici";
import { mesclarCabecalhos } from "./util.js";
import morgan from "morgan";
import porFim from "finalhandler";
import criarErro from "http-errors";

const registrar = morgan(
  // veja https://www.npmjs.com/package/morgan#tokens
  ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
  // não escreve cors preflight no console
  { skip: (req) => req.method == "OPTIONS" }
);

/** A instância do servidor proxy */
const servidor = criarServidor((req, res) => {
  /** Último tratamento da requisição, **para entregar erros somente** */
  const terminado = porFim(req, res);

  // requisição passa pelo pacote "morgan" para registrar na saída do console
  registrar(req, res, (erro) => {
    if (erro) return terminado(erro);

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

        return terminado(criarErro(400, "Não há um endereço no cabeçalho da requisição, defina 'endereco-alvo' com o endereço [<scheme>://<hostname> | <scheme>://<hostname>:<port>] a ser requisitado"));
      } else {

        if (Array.isArray(endereco)) endereco = endereco[0];
        delete req.headers["endereco-alvo"];
      }

      requisicao(endereco + req.url, { method: req.method, body: req.body, headers: mesclarCabecalhos(req.headers) })
        .then(async (alvoRes) => {
          // erro de CORS ainda pode ser retornado se a política anti-script do alvo não permitir requisições desta origem
          
          // abordagem comum, os navegadores calculam o tamanho ao final caso 'content-length' não esteja definido
          res.writeHead(alvoRes.statusCode, alvoRes.headers);
          alvoRes.body.pipe(res);

          // adaptação para prover 'content-length' cabeçalho independente do '.statusCode'
          // - esta abordagem adiciona tempo de resposta no proxy
          /* alvoRes.body.arrayBuffer()
            .then((buff) => {
              alvoRes.headers["Content-Length"] = Buffer.byteLength(buff, alvoRes.body.readableEncoding);
              res.writeHead(alvoRes.statusCode, alvoRes.headers);
              res.write(buff, "binary");
              res.end(null, "binary");
            }) */
        })
        .catch(terminado)
    }
  })

});

/** @type {number} */
const porta = Number(process.env.PORT) || 44;

servidor.listen(porta, () => {
  console.log("Servidor proxy escutando na porta " + porta);
});

// FIXME: lidar com possível erro de runtime no node e prevenir de finalizar o process
