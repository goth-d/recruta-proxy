## recruta-proxy
---

http/1.1 localhost proxy

Direciona quaisquer **cors requisições** http para a internet

- aceita verbos "GET, PUT, PATCH, POST, DELETE"

---
### USO

Por agora, na sua aplicação modifique a requisição manualmente:
1. modifique a url para apontar o host do proxy, ex: `http://localhost:44/caminho-relativo-ao-endereco-alvo`
2. defina o domínio do endereço alvo como cabeçalho `endereco-alvo` no objeto `Headers`, ex: `https://google.com`

No proxy é usada a porta `44` como padrão, você pode especificar outra porta definindo no **env**:
- modificando o objeto `env` do arquivo `ecosystem.config.cjs`
- ou utilize o pacote `cross-env` para adicionar a variável `PORT` 

Os cabeçalhos http padrões são purgadados antes de serem passados adiante, a maioria é omitida, revise `util.js`.

---
### INSTRUÇÕES

Clone o repositório localmente com git, e no diretório:

1. instale os pacotes com > `npm install` ou `yarn`
2. incie a aplicação:
  - ### execute `bg` > `npm run bg` ou `yarn bg`, rodará no plano de fundo
  - execute `start` > `npm start` ou `yarn start`, rodará no processo principal (**não recomendado**)

### Ctrl-C não irá encerrar o servidor de plano de fundo, para terminar o processo execute o `stop` > `npm run stop` ou `yarn stop`.

Caso esteja rodando em plano de fundo, pode visualizar um painel com detalhes e logs executando o script `monit`.