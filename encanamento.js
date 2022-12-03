import { Writable as Escrevivel } from "stream";
import morgan from "morgan";

class MorganFluxoEscrevivel extends Escrevivel {
  constructor(depurador,...args) {
    super(args);
    this.depurador = depurador;
  }
  /** Tokens do morgan são passados para o depurador */
  write(socketTokens) {
    this.depurador(String(socketTokens).trimEnd() /* previne eol com \n, entao o depurador pode modificar a saída */ );
  }
}

/**
 * Gera registros das requisições
 * @param {debug.Debugger | Function} depurador Função que imprime uma string, ex: console.log
 * @returns {import("./servidor.js").RequisiçãoEncanamento}
 */
const ImprimeRegistros = (depurador) => {
  return morgan(
    // veja https://www.npmjs.com/package/morgan#tokens
    ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
    {
      // não escreve cors preflight no console
      skip: (req) => req.method == "OPTIONS",
      stream: new MorganFluxoEscrevivel(depurador),
    }
  );
}

export default ImprimeRegistros;