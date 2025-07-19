import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { formatPokemonId, formatPokemonName } from '../services/PokemonService';

// componente que renderiza um card individual para cada pokemon
const PokemonCard = ({ pokemon, onPress }) => {
  // pega o tipo primario do pokemon para definir a cor do card
  const primaryType = pokemon.types?.[0] || 'normal';
  const typePastelColor = theme.colors.pastelTypes[primaryType];
  
  // estado para controlar se houve erro ao carregar a imagem
  const [imageError, setImageError] = useState(false);

  // funcao executada quando ocorre erro no carregamento da imagem
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <CardContainer onPress={() => onPress(pokemon.id, pokemon.name)}>
      <CardBackground typeColor={typePastelColor}>
        {/* renderiza a imagem do pokemon ou um placeholder em caso de erro */}
        {!imageError ? (
          <PokemonImage 
            source={{ uri: pokemon.image }} 
            onError={handleImageError}
          />
        ) : (
          <PlaceholderImage>
            <PlaceholderText>?</PlaceholderText>
          </PlaceholderImage>
        )}
        
        {/* conteudo do card com informacoes do pokemon */}
        <CardContent>
          <PokemonId>{formatPokemonId(pokemon.id)}</PokemonId>
          <PokemonName>{formatPokemonName(pokemon.name)}</PokemonName>
          
          {/* container para os badges dos tipos do pokemon */}
          <TypeContainer>
            {pokemon.types?.map((type, index) => (
              <TypeBadge key={index} typeColor={theme.colors.types[type]}>
                <TypeText>{type}</TypeText>
              </TypeBadge>
            ))}
          </TypeContainer>
        </CardContent>
      </CardBackground>
    </CardContainer>
  );
};

// estilos dos componentes usando styled-components

// container principal do card com funcionalidade de toque
const CardContainer = styled(TouchableOpacity)`
  flex: 1;
  margin: ${theme.spacing.xs}px;
  min-width: 150px;
  max-width: 200px;
`;

// fundo do card com cor baseada no tipo do pokemon
const CardBackground = styled.View`
  background-color: ${props => props.typeColor || theme.colors.card};
  border-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.m}px;
  shadow-color: ${theme.shadows.shadowColor};
  shadow-offset: ${theme.shadows.shadowOffset.width}px ${theme.shadows.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.shadowOpacity};
  shadow-radius: ${theme.shadows.shadowRadius}px;
  elevation: ${theme.shadows.elevation};
  opacity: 0.9;
  border-width: 4px;
  border-color: black;
`;

// imagem do pokemon centralizada no card
const PokemonImage = styled.Image`
  width: 80px;
  height: 80px;
  align-self: center;
  margin-bottom: ${theme.spacing.s}px;
`;

// container para o conteudo textual do card
const CardContent = styled.View`
  align-items: center;
`;

// texto do id do pokemon formatado
const PokemonId = styled.Text`
  font-size: ${theme.textProp.sizes.xs}px;
  font-weight: ${theme.textProp.weights.medium};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
`;

// nome do pokemon em destaque
const PokemonName = styled.Text`
  font-size: ${theme.textProp.sizes.m}px;
  font-weight: ${theme.textProp.weights.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.s}px;
  text-align: center;
`;

// container para organizar os badges dos tipos
const TypeContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${theme.spacing.xs}px;
`;

// badge individual para cada tipo do pokemon
const TypeBadge = styled.View`
  background-color: ${props => props.typeColor};
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.s}px;
`;

// texto do tipo dentro do badge
const TypeText = styled.Text`
  font-size: ${theme.textProp.sizes.xxs}px;
  font-weight: ${theme.textProp.weights.medium};
  color: white;
  text-transform: capitalize;
`;

// placeholder exibido quando a imagem nao carrega
const PlaceholderImage = styled.View`
  width: 80px;
  height: 80px;
  align-self: center;
  margin-bottom: ${theme.spacing.s}px;
  background-color: ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  justify-content: center;
  align-items: center;
`;

// texto do placeholder
const PlaceholderText = styled.Text`
  font-size: 24px;
  font-weight: ${theme.textProp.weights.bold};
  color: ${theme.colors.textSecondary};
`;

export default PokemonCard;
