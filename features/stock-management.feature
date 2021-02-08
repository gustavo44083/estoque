#language: pt

Funcionalidade: Gestão de Estoque
  Eu como estoquista
  desejo cadastrar/alterar e excluir produtos no meu sistema de estoque.

  Contexto:
    Dados os seguintes produtos cadastrados:
      | Título     | SKU   | Valor unitário | Estoque |
      | Smartphone | SV425 | 2000           | 576     |
      | Monitor    | WZ659 | 2500           | 37      |
      | Notebook   | OH677 | 3000           | 26      |
      | Mouse      | VK537 | 150            | 512     |

  Cenario: Usuário registra um novo produto
    Dado que não há um produto de SKU "BJ521" cadastrado
    Quando clicar no botão de adicionar um novo produto
    E preencher os seguintes dados do produto:
      | Título     | SKU   | Valor unitário | Estoque |
      | Carregador | BJ521 | 200            | 152     |
    E salvar o produto
    Então o produto de SKU "BJ521" deve ser cadastrado com sucesso
    E o usuário deve ver o produto de nome "Carregador" na lista

  Cenário: Usuário edita um produto existente
    Dado que o título do produto de SKU "SV425" é "Smartphone"
    Quando clicar no produto de SKU "SV425"
    E alterar o título para "Smartphone Samsung"
    E alterar o estoque para 512
    E salvar o produto
    Então o título do produto de SKU "SV425" deve ser "Smartphone Samsung"
    E o estoque do produto de SKU "SV425" deve ser de 512

  Cenário: Usuário remove múltiplos produtos
    Dado que há um produto de SKU "WZ659" cadastrado
    E que há um produto de SKU "OH677" cadastrado
    Quando selecionar o produto de SKU "WZ659"
    E selecionar o produto de SKU "OH677"
    E clicar no botão de deletar produtos
    Então o produto de SKU "WZ659" não deve ser mostrado
    E o produto de SKU "OH677" não deve ser mostrado
