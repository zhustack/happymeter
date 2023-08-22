# Workshop SAP BTP for HR

Primeiramente, muito bem-vindo(a)! Será um prazer compartilhar nosso conhecimento e trocar experiências. 

## Conhecendo um pouco a estrutura do projeto

Ele contém essas pastas e arquivos, seguindo nosso layout de projeto recomendado:

Arquivo ou pasta | Propósito
---------|----------
`app/` | o conteúdo para interfaces de interface do usuário vai aqui
`db/` | seus modelos de domínio e dados vão aqui
`srv/` | seus modelos de serviço e código vão aqui
`pacote.json` | metadados e configuração do projeto
`readme.md` | este guia de introdução

## Após clonar o projeto
- Abra um novo terminal e execute `npm i` para instalar todas as dependências do projeto.
- Execute `cf login -t [SEU_ENDPOINT_AQUI]`
- Execute `npm run build`
- Execute `npm run deploy`
- Após o sucesso do deploy, execute o comando `cf env [NOME_DO_APP_BACKEND] > default-env.json`, certifique-se de formatar o arquivo json de saída para que você utilizar as variáveis e configurações do ambiente.


## Executando a primera vez

- Abra um novo terminal e execute `cds watch`
- Copie algum id de usuário na sessão `package.json > cds > requires > auth > [development] > users`.
- Execute a aplicação em `localhost:4004`, ao acessar qualquer recurso, será aberta um prompt, nesse prompt cole o id do usuário que deseja acessar.

## Próximos passos
- Agora que você já conhece a estrutura do projeto e como ele se comunica com o SAP SuccessFactors, vamos realizar a leitura da última avaliação de sentimento (**mood**) realizada pelo colaborador.
  
