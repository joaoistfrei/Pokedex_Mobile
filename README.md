============ Pokédex Mobile ============

Um app mobile de Pokédex construído com React Native e o Expo go, trazendo todos os Pokémons da PokéAPI. O app tem uma interface intuitiva e permite pesquisar e compartilhar seus Pokémon favoritos =)


== Funcionalidades ==

-> Pokédex completa com todos os Pokémon
-> Sistema de busca por nome ou número
-> Telas detalhadas com stats, tipos, altura e peso
-> Compartilhamento de cards como imagem (iOS e Android)
-> Design responsivo para diferentes dispositivos
-> Navegação fluida entre telas


== Detalhes técnicos ==

- React Native & Expo SDK 53
- Styled Components para estilização
- React Navigation para navegação
- PokéAPI para dados dos Pokémon
- Expo Media Library & React Native View Shot para screenshots


== Estrutura do projeto ==

```
pokedex/
├── App.js                      
├── app.json                    
├── babel.config.js             
├── package.json                
├── images/
│   └── pokeball.png           
└── src/
    ├── theme.js               
    ├── components/
    │   └── PokemonCard.js     
    ├── navigation/
    │   └── AppNavigator.js    
    ├── screens/
    │   ├── ListScreen.js      
    │   └── DetailsScreen.js   
    └── services/
        └── PokemonService.js  
```

== Como Rodar o Projeto ==

=> Pré-requisitos:

- Node.js (v16+)
- Expo CLI instalado globalmente
- Simulador iOS ou Android Studio configurado

=> Instalação:

```bash
git clone https://github.com/joaoistfrei/Pokedex_Mobile.git

cd Pokedex_Mobile

npm install

npm install -g @expo/cli

npx expo start
```


Para rodar em um dispositivo específico:

```bash
npx expo start --ios

npx expo start --android

npx expo start --web
```


== Processo de desenvolvimento ==

=> Desafios e soluções:

O maior desafio foi fazer o compartilhamento funcionar no Android. No iOS funcionava perfeitamente (onde comecei os testes), mas no Android só compartilhava texto. Depois de muito debugging descobri que:

No iOS o `Share.share()` nativo funciona bem com URLs de imagem, já no Android a API nativa tem limitações com arquivos de imagem.


== Referências e inspirações ==

=> Documentação oficial do React Native
=> Documentação do PokéAPI -> https://pokeapi.co/
=> Mini tutoriais de react: 
-https://youtu.be/G6D9cBaLViA
-https://www.youtube.com/watch?v=-L0BSSQBWOI


== Uso de Inteligência Artificial ==

Nesse projeto, utilizei o Github Copilot para me auxiliar em detalhes técnicos da implementação de várias funções e em como definir a estrutura do projeto como um todo. Como desenvolvi no VSCode, ele me ajudou a entender como instalar as dependências e preparar o projeto para ser utilizado e testado. 


== Próximas ideias de melhoria ==

-> Adicionar favoritos
-> Implementar busca por tipo
-> Colocar animações
-> Cache offline dos dados
-> Modo escuro
-> Ver as habilidades e golpes de cada Pokémon


== Licença ==

Projeto educacional. Pokémon é marca registrada da Nintendo, Game Freak e Creatures Inc.