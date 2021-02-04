#language: pt

Funcionalidade: Gestão de Estoque
  Eu como estoquista
  desejo cadastrar/alterar e excluir produtos no meu sistema de estoque.

  Contexto:
    Dados os seguintes produtos cadastrados:
      | Título     | SKU   | Estoque |
      | Smartphone | SV425 | 576     |
      | Monitor    | WZ659 | 37      |
      | Notebook   | OH677 | 26      |
      | Mouse      | VK537 | 512     |

  Cenário: Usuário acessa a página inicial
    Quando acessar a página inicial
    Então deverá ver todos os produtos cadastrados e seus respectivos estoques

  Cenario: Usuário registra um novo produto
    Dado que não há um produto de SKU "BJ521" cadastrado
    Quando clicar no botão de adicionar um novo produto
    E preencher os seguintes dados do produto:
      | Título     | SKU   | Estoque |
      | Carregador | BJ521 | 152     |
    E clicar em concluir
    Então o produto deve ser cadastrado com sucesso

  Cenário: Usuário edita um produto existente
    Dado que o título do produto de SKU "SV425" é "Smartphone"
    Quando acessar a página inicial
    E clicar no produto de SKU "SV425"
    E alterar o título para "Smartphone Samsung"
    E alterar o estoque para 512
    Então o título do produto de SKU "SV425" deve ser "Smartphone Samsung"
    E o estoque do produto de SKU "SV425" deve ser de 512
    
  Cenário: Usuário remove múltiplos produtos
    Dado que o produto de SKU "WZ659" não foi removido
    E que o produto de SKU "OH677" não foi removido
    Quando selecionar o produto de SKU "WZ659"
    E selecionar o produto de SKU "OH677"
    E clicar no botão de deletar produtos
    E confirmar a exclusão
    Então o produto de SKU "WZ659" não deve ser mostrado
    E o produto de SKU "OH677" não deve ser mostrado


