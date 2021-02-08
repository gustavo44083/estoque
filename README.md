## Sobre
Este é um projeto de exemplo, criado para demonstrar uma aplicação de gestão de estoque.

## Começando

### Pré-requisitos
- NodeJS 10.0+
- MySQL/MariaDB

### Instalação
Antes de tudo, faça um clone do repositório usando ``

Para cada pacote no diretório `packages`, execute os seguintes comandos:
1. Instale as dependências usando `npm install`
2. Crie o arquivo `.env` (use o arquivo `example.env` como um exemplo)
3. Use `npm start` para iniciar o pacote

### Docker
Para executar este projeto no Docker, use o comando `docker-compose up`.

## Utilização
Após configurar um ambiente e executar tanto o front-end quanto o back-end, a aplicação poderá ser acessada
em um navegador (http://localhost:8080 por padrão).

Por padrão, a aplicação é iniciada sem nenhum produto cadastrado. O script `npm run populate` pode ser usado
para popular o banco de dados com produtos aleatórios.

Também é possível acessar a API da aplicação (http://localhost:3000/api/v1 por padrão). Veja a documentação
da API [aqui](https://documenter.getpostman.com/view/1217340/TW74iQVA).

## Testes
Cada pacote possui testes unitários específicos. Para executá-los, utilize o comando `npm test` em cada pacote.

Os testes End-to-End são executados a partir da base do projeto. Siga esses passos para configurar o ambiente:
1. Instale os pacotes na base do projeto usando `npm install`
2. Crie o arquivo `e2e-config.json` (use o arquivo `e2e-config.example.json` como exemplo)
3. Use o comando `npm test` na base do projeto para iniciar os testes E2E

Também é possível (e recomendado) executar os testes em um ambiente Docker. Para isso, use o comando
`npm run test:docker`

## Licença
Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para obter mais informações.

## Contato
Gustavo Ferreira - gustavo44083@gmail.com
