<<<<<<< HEAD
=======
# Pokémon Quiz

**Projeto pessoal · AI-Assisted Development / Vibe Coding**  
*Status: Em desenvolvimento contínuo*

---

## Sobre o Projeto

O **Pokémon Quiz** é um jogo de perguntas baseado na identificação de Pokémon. A proposta é apresentar um grande conjunto de Pokémon organizados visualmente por regiões e categorias, enquanto o jogador tenta descobrir as entradas digitando seus nomes.

O projeto contempla Pokémon das Gerações 1 a 9, incluindo formas regionais e diferentes categorias de formas alternativas. A aplicação foi desenvolvida como um projeto pessoal com foco em:

- exploração de desenvolvimento web com JavaScript;
- manipulação e organização de dados externos;
- criação de uma interface de quiz;
- tratamento de diferentes formas de Pokémon;
- persistência do estado do jogo;
- desenvolvimento iterativo e correção de problemas reais encontrados durante os testes.

## Origem e Inspiração

A ideia inicial surgiu a partir do site *pkmnquiz.com*, utilizado como referência para o conceito geral do jogo. O site original não estava acessível no computador utilizado durante o desenvolvimento. A partir disso, surgiu a ideia de recriar a experiência como um projeto próprio, utilizando a referência original apenas como inspiração para o conceito do quiz.

A implementação deste projeto é independente e foi sendo modificada conforme novas necessidades e ideias surgiram durante o desenvolvimento. Além de reproduzir a ideia básica de descobrir Pokémon, o projeto passou a incorporar funcionalidades e regras próprias, especialmente relacionadas ao tratamento de formas, modos de jogo e organização visual do board.

## Desenvolvimento Assistido por IA

Este projeto foi desenvolvido utilizando **AI-Assisted Development**, também conhecido como *Vibe Coding*. A inteligência artificial foi utilizada como ferramenta de desenvolvimento ao longo do projeto, incluindo:

- criação de código, estruturação e modularização;
- refatoração, análise de bugs e investigação de comportamentos inesperados;
- revisão de lógica, sugestões de arquitetura e implementação de novas funcionalidades.

O uso de IA não significa que o projeto foi simplesmente gerado e utilizado sem validação. As funcionalidades desejadas, regras do quiz, decisões de arquitetura e critérios de funcionamento foram definidos durante o desenvolvimento e posteriormente testados e ajustados em várias iterações, como a divisão de um arquivo monolítico em módulos para facilitar a manutenção. O objetivo deste README é ser transparente: a IA fez parte efetiva do processo de programação como ferramenta, enquanto o projeto foi conduzido por decisões humanas.

## Principais Funcionalidades

- Quiz com Pokémon das Gerações 1–9
- Modos *All Pokémon*, por geração e por tipo
- Formas regionais, Mega Evolutions e Gigantamax
- Configurações para definir como formas devem ser respondidas
- Timer e contador de progresso
- Salvamento e restauração da partida
- *New Game* e *Give Up*
- Board responsivo organizado por regiões
- Feedback para respostas inválidas, repetidas e fora do quiz
- Cache local dos dados da PokéAPI

## Regras e Tratamento de Formas

O sistema processa as respostas digitadas (normalizando capitalização e hífens) e verifica a correspondência dentro da configuração atual da partida. Uma única resposta pode revelar mais de uma entrada caso as configurações determinem que formas diferentes compartilham o mesmo nome de resposta (ex: digitar o nome da espécie base revelando todas as suas variações ativas).

Para a organização e resposta, as formas seguem três categorias de configuração no jogo:
* **Formas Regionais:** Podem ser respondidas individualmente (ex: *Alolan Meowth*) ou agrupadas sob a espécie base (*Meowth*), mantendo suas posições nas caixas das respectivas regiões.
* **Formas Gimmick/Especiais:** Controla *Mega Evolutions*, *Gigantamax* e o tratamento específico de *Eternamax*. Possuem caixas próprias no final do board para não se misturarem com as regiões, e podem ser exigidas individualmente ou reveladas pela espécie base.
* **Other Forms:** Engloba formas que não se encaixam nas categorias acima. Segue a mesma lógica de exigência de especificidade na resposta.

## Arquitetura

O projeto utiliza JavaScript ES Modules, com responsabilidades separadas entre estado, carregamento de dados, regras de classificação de Pokémon, construção do quiz, board e eventos da interface.

## Persistência e Estado

O estado da partida é persistido com `localStorage`, permitindo restaurar Pokémon encontrados, configurações e progresso. Alterações de configuração são armazenadas como "pendentes" e aplicadas apenas ao iniciar uma nova partida, evitando a perda acidental do progresso atual.

* **New Game:** Inicia uma nova partida, limpa o progresso anterior, aplica configurações pendentes e reinicia o timer.
* **Give Up:** Encerra a tentativa atual, pausa o timer e revela as entradas que não foram encontradas pelo jogador.

## Stack Tecnológica

| Componente | Tecnologia |
| :--- | :--- |
| **Estrutura e Estilos** | HTML5, CSS3 |
| **Lógica** | JavaScript (ES Modules, sem frameworks) |
| **Dados e Cache** | PokéAPI, localStorage, cache de processamento local |
| **Desenvolvimento** | Git, GitHub, AI-Assisted Development |

## Estrutura do Projeto

* `index.html` — estrutura principal.
* `style.css` — estilos e comportamento visual responsivo.
* `js/main.js` — inicialização e integração.
* `js/config.js` — configurações gerais, gerações e regiões.
* `js/state.js` — estado compartilhado.
* `js/dom.js` — referências de interface.
* `js/utils.js` — funções utilitárias e normalização.
* `js/cache.js` — gerenciamento do cache local.
* `js/api.js` — carregamento de dados.
* `js/pokemon.js` — manipulação das entradas.
* `js/forms.js` — classificação e nomenclatura.
* `js/quiz.js` — construção do quiz e filtros.
* `js/board.js` — criação do board visual.
* `js/game.js` — controle da partida e respostas.
* `js/events.js` — eventos de controles.

## Fonte dos Dados

Os dados base são consumidos da [PokéAPI](https://pokeapi.co/). Após o carregamento inicial, os dados (identificador, nome, espécie, geração, formas, tipos e sprites) são armazenados em cache local para evitar requisições redundantes.

**Tratamento de Formas e Dados**  
Um dos principais desafios técnicos do projeto é mapear a estrutura da API para as regras visuais e mecânicas do quiz. O jogo possui uma camada própria de classificação (`forms.js`) que categoriza os dados recebidos em: Pokémon normal, forma regional, Mega Evolution, Gigantamax ou outras formas. É essa camada que determina dinamicamente o nome exibido, o nome aceito como resposta, a região, a geração e a seção correta do board, isolando essas exceções para que não poluam a interface ou as regras de pontuação.

## Roadmap

- [ ] Finalizar e aprimorar o tratamento de *Other Forms*.
- [ ] Finalizar o sistema de mensagens de resposta.
- [ ] Destacar visualmente caixas de regiões quando forem concluídas.
- [ ] Adicionar opção de *Shiny Sprites*.
- [ ] Adicionar opção de Pokémon em sombra para aumentar a dificuldade.
- [ ] Implementar tratamento completo de Pokémon com tipos variáveis (ex: Arceus, Silvally, Castform, Ogerpon).
- [ ] Adicionar modos de jogo adicionais (por cor, inspiração, jogo, rota/localidade).
- [ ] Continuar aprimorando a responsividade do board e regras de exceção da Pokédex.

## Status do Projeto

A estrutura principal do jogo já está funcional (carregamento, filtros, respostas, revelação, timer, persistência, formas e modos). O desenvolvimento atual está concentrado em refinamentos de regras, tratamento de exceções da Pokédex, melhorias de apresentação da interface e implementação de novos modos de jogo. Este é um projeto pessoal mantido em tempo livre, sem fins comerciais.

## Aviso de Propriedade Intelectual

Pokémon, seus nomes, personagens, imagens e demais propriedades relacionadas pertencem aos seus respectivos detentores de direitos. Este projeto é **não oficial**, independente e sem afiliação com Nintendo, The Pokémon Company ou Game Freak. Criado exclusivamente para fins de estudo, experimentação técnica e entretenimento pessoal.
>>>>>>> 71fb2a165b7964e801ebae06c0dbceb864118c4d
