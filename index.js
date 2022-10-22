import { createServer as criarServidor } from "http";
import { request as requisicao } from "undici";
import { mesclarCabecalhos } from "./util.js";

/** A instância do servidor proxy */
const servidor = criarServidor((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", req.headers['access-control-request-headers'] || "");

  if (req.method == "OPTIONS") {
    // cors preflight
    res.statusCode = 200;
    res.write("");
  } else {
    const endereco = req.headers["endereco-alvo"]; // endereco alvo url <scheme>://<hostname> | <scheme>://<hostname>:<port>
    if (!endereco) {
      res.statusCode = 400;
      res.end(JSON.stringify({ erro: "Não há um endereço no cabeçalho da requisição" }));
      return;
    } else delete req.headers["endereco-alvo"]

    // TODO: add requisicao log

    requisicao(endereco + req.url, { method: req.method, body: req.body, headers: mesclarCabecalhos(req.headers) })
      .then((alvoRes) => {

        res.writeHead(alvoRes.statusCode, alvoRes.headers);
        alvoRes.body.pipe(res);
      }).catch((erro) => {
        console.log(erro);

        res.statusCode = 500;
        res.end(JSON.stringify({ erro: "Erro durante a requisição, verifique o erro no servidor" }));
      })
  }

});

/** @type {number} */
const porta = process.env.PORT || 44;

servidor.listen(Number(porta), () => {
  console.log("Servidor proxy http/1.1 escutando na porta " + porta);
});

// FIXME: lidar com possível erro de runtime no node e prevenir de finalizar o process
