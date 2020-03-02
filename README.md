# cepNodejs
Projeto de um CRUD de CEP usando NodeJs e MySQL

Antes de começar favor verificar se possue o NodeJs instalado.
  NodeJs: https://nodejs.org/
Se o database for local, instalar o MySQL e criar o database teste_py.

Passos para executar o código:
1- Fazer download ou clone do projeto.

2- Ir no arquivo file.json e inserir os dados do Banco de dados, caso não seja o localhost (atenção, verificar se o database é teste_py)

3- Caso não exista a tabela dados_dep, executar o código sql:
  CREATE TABLE `dados_dep` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`cep` int(11) DEFAULT NULL,
`nome` varchar(45) NOT NULL,
`endereco` varchar(255) DEFAULT NULL,
`bairro` varchar(255) DEFAULT NULL,
`estado` varchar(2) DEFAULT NULL,
`cidade` varchar(255) DEFAULT NULL,
`retorno_api` json DEFAULT NULL,
`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
`updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE
CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

4- no terminal do projeto executar: npm install

5- depois: node app.js

6- no navegador escrever a url: http://localhost:3000/
