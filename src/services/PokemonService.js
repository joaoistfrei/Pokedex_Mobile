const POKEMON_LIMIT = 2000; 
const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonService = {
  async fetchPokemonList() {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
      const data = await response.json();
      
      const mainPokemon = data.results.filter(pokemon => {
        // Keep all Pokemon without hyphens
        if (!pokemon.name.includes('-')) {
          return true;
        }
        
        const allowedForms = [
          'nidoran-f', 'nidoran-m', 'mr-mime', 'mime-jr',
          'ho-oh', 'porygon-z', 'jangmo-o', 'hakamo-o', 'kommo-o',
          'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini',
          'type-null', 'great-tusk', 'scream-tail', 'brute-bonnet',
          'flutter-mane', 'slither-wing', 'sandy-shocks', 'iron-treads',
          'iron-bundle', 'iron-hands', 'iron-jugulis', 'iron-moth',
          'iron-thorns', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu'
        ];
        
        // Pulando formas variantes de Pokémon
        const variantPatterns = [
          'mega', 'alola', 'galar', 'hisui', 'paldea', 'gmax',
          'totem', 'primal', 'origin', 'therian', 'zen',
          'speed', 'attack', 'defense', 'sunny', 'rainy', 'snowy',
          'fan', 'frost', 'heat', 'mow', 'wash', 'blade',
          'small', 'large', 'super', 'school', 'solo',
          'midnight', 'dusk', 'dawn', 'complete', 'unbound',
          'pirouette', 'resolute', 'crowned', 'eternamax',
          'low-key', 'hangry', 'noice', 'gulping', 'gorging',
          'rapid-strike', 'single-strike', 'hero', 'roaming',
          'stretchy', 'droopy', 'aqua-breed', 'blaze-breed',
          'combat-breed', 'wellspring', 'hearthflame', 'cornerstone',
          'stellar', 'terastal', 'bloodmoon', 'three-segment',
          'drive-mode', 'glide-mode', 'aquatic-mode', 'low-power-mode',
          'sprinting-build', 'swimming-build', 'gliding-build', 'limited-build'
        ];
        
        const isVariant = variantPatterns.some(pattern => 
          pokemon.name.includes(pattern)
        );
        
        return allowedForms.includes(pokemon.name) || !isVariant;
      });
      
      return mainPokemon.map((pokemon, index) => {
        const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
        
        return {
          id: parseInt(pokemonId),
          name: pokemon.name,
          url: pokemon.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
        };
      });
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  },

  async fetchPokemonDetails(pokemonId) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${pokemonId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! -> ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: data.types.map(type => type.type.name),
        stats: data.stats.map(stat => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
      };
    } catch (error) {
      console.error(`Error fetching details from ${pokemonId} ->`, error);
      throw error;
    }
  },
};

export const formatPokemonId = (id) => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatHeight = (height) => {
  return `${(height / 10).toFixed(1)} m`;
};

export const formatWeight = (weight) => {
  return `${(weight / 10).toFixed(1)} kg`;
};

export const formatStatName = (statName) => {
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  };
  
  return statNames[statName] || statName;
};

export { POKEMON_LIMIT };
