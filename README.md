## localhost-http-proxy
---

Simples http/1.1 localhost proxy

Direciona quaisquer **cors requisições** http para a internet

- aceita verbos "GET, PUT, PATCH, POST, DELETE"

---
### USO

Por agora, modifique a requisição manualmente:
1. modifique a url para apontar o host do proxy, ex: `http://localhost:44/caminho-relativo-ao-endereco-alvo`
2. defina o domínio do endereço alvo como cabeçalho `endereco-alvo` no objeto `Headers`, ex: `https://google.com`

É usada a porta `44` como padrão.

A maioria dos cabeçalhos http padrões são purgadados antes de serem passados adiante, revise `util.js`.

---
### INSTRUÇÕES

clone o repositório localmente com git, e no diretório:

1. execute `npm install` ou `yarn`
2. execute o script `start` > `npm start` ou `yarn start`