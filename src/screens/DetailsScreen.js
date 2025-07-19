import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, Share, Linking, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { pokemonService, formatPokemonId, formatPokemonName, formatHeight, formatWeight, formatStatName, POKEMON_LIMIT } from '../services/PokemonService';

// tela de detalhes do pokemon com informacoes completas
const DetailsScreen = ({ route, navigation }) => {
  // parametros recebidos da navegacao
  const { pokemonId, pokemonName } = route.params;
  
  // estados para gerenciar dados do pokemon, carregamento e erros
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // referencia para capturar screenshot da tela
  const viewRef = useRef();

  // hook executado quando o componente é montado ou o id muda
  useEffect(() => {
    fetchPokemonDetails(pokemonId);
  }, [pokemonId]);

  // funcao para buscar detalhes do pokemon na API
  const fetchPokemonDetails = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const details = await pokemonService.fetchPokemonDetails(id);
      setPokemon(details);
    } catch (err) {
      console.error('Error fetching Pokemon details:', err);
      setError(err.message);
      Alert.alert('Error', 'Failed to load Pokemon details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // navegar para o pokemon anterior
  const handlePrevious = () => {
    if (pokemonId > 1) {
      const newId = pokemonId - 1;
      navigation.setParams({ pokemonId: newId });
      fetchPokemonDetails(newId);
    }
  };

  // navegar para o proximo pokemon
  const handleNext = () => {
    if (pokemonId < POKEMON_LIMIT) {
      const newId = pokemonId + 1;
      navigation.setParams({ pokemonId: newId });
      fetchPokemonDetails(newId);
    }
  };

  // mostrar opcoes de compartilhamento
  const handleShare = async () => {
    setShowShareOptions(true);
  };

  // compartilhar imagem do pokemon
  const handleShareImage = async () => {
    setShowShareOptions(false);
    try {
      // aguarda o modal fechar completamente e a imagem carregar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // verifica se a referencia ainda e valida
      if (!viewRef.current) {
        Alert.alert('Error', 'Unable to capture screen. Please try again.');
        return;
      }
      
      // captura screenshot da tela
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      // salva a imagem no dispositivo (apenas se for iOS ou se tiver permissao)
      try {
        await MediaLibrary.saveToLibraryAsync(uri);
      } catch (saveError) {
        console.log('Could not save to library:', saveError.message);
        // continua mesmo se nao conseguir salvar
      }
      
      // compartilha usando metodo especifico para cada plataforma
      if (Platform.OS === 'ios') {
        // iOS: usa Share nativo que suporta imagens
        await Share.share({
          message: `Check out ${formatPokemonName(pokemon.name)} ${formatPokemonId(pokemon.id)} from the Pokédx!`,
          url: uri,
          title: `${formatPokemonName(pokemon.name)} - Pokemon Card`,
        });
      } else {
        // Android: usa expo-sharing que funciona melhor com imagens
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `${formatPokemonName(pokemon.name)} - Pokemon Card`,
          });
        } else {
          // fallback para compartilhar apenas texto se sharing nao estiver disponivel
          await Share.share({
            message: `Check out ${formatPokemonName(pokemon.name)} ${formatPokemonId(pokemon.id)} from the Pokédx!`,
            title: `${formatPokemonName(pokemon.name)} - Pokemon Card`,
          });
        }
      }
      
      Alert.alert('Success', 'Pokemon card saved to your photos and shared!');
    } catch (err) {
      console.error('Error sharing image:', err);
      Alert.alert('Error', 'Failed to share image. Please try again.');
    }
  };

  // compartilhar link do pokemon
  const handleShareLink = async () => {
    setShowShareOptions(false);
    try {
      const pokemonUrl = `https://www.pokemon.com/us/pokedex/${pokemon.id}`;
      const message = `Check out ${formatPokemonName(pokemon.name)} ${formatPokemonId(pokemon.id)} from the Pokédex!`;
      
      await Share.share({
        message: message,
        url: pokemonUrl,
        title: `${formatPokemonName(pokemon.name)} - Pokédex`,
      });
    } catch (err) {
      console.error('Error sharing link:', err);
      Alert.alert('Error', 'Failed to share link. Please try again.');
    }
  };

  // cancelar compartilhamento
  const handleCancelShare = () => {
    setShowShareOptions(false);
  };

  // navegar para a tela inicial
  const handleHome = () => {
    navigation.navigate('Pokédex');
  };

  // renderizar tela de carregamento
  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <LoadingText>Loading Pokemon...</LoadingText>
      </LoadingContainer>
    );
  }

  // renderizar tela de erro
  if (error || !pokemon) {
    return (
      <ErrorContainer>
        <ErrorText>Failed to load Pokemon details</ErrorText>
        <RetryButton onPress={() => fetchPokemonDetails(pokemonId)}>
          <RetryText>Retry</RetryText>
        </RetryButton>
      </ErrorContainer>
    );
  }

  // definir cor baseada no tipo primario do pokemon
  const primaryType = pokemon.types[0];
  const typePastelColor = theme.colors.pastelTypes[primaryType];

  return (
    <Container typeColor={typePastelColor}>
      {/* view capturavel para screenshot */}
      <ShareableView 
        ref={viewRef}
        collapsable={false}
        typeColor={typePastelColor}
        renderToHardwareTextureAndroid={true}
      >
        {/* header com navegacao e titulo */}
        <Header>
          <HeaderLeft>
            <HeaderButton onPress={handleHome}>
              <HeaderButtonText>🏠</HeaderButtonText>
            </HeaderButton>
          </HeaderLeft>
          
          <HeaderCenter>
            <HeaderTitle>{formatPokemonName(pokemon.name)}</HeaderTitle>
            <HeaderSubtitle>{formatPokemonId(pokemon.id)}</HeaderSubtitle>
          </HeaderCenter>
          
          <HeaderRight>
            {/* botoes de navegacao entre pokemons */}
            <NavButton onPress={handlePrevious} disabled={pokemonId <= 1}>
              <NavButtonText disabled={pokemonId <= 1}>◀</NavButtonText>
            </NavButton>
            <NavButton onPress={handleNext} disabled={pokemonId >= POKEMON_LIMIT}>
              <NavButtonText disabled={pokemonId >= POKEMON_LIMIT}>▶</NavButtonText>
            </NavButton>
          </HeaderRight>
        </Header>

        {/* conteudo principal com informacoes do pokemon */}
        <Content>
          {/* badges dos tipos do pokemon */}
          <TypeBadgeContainer>
            {pokemon.types.map((type, index) => (
              <TypeBadge key={index} typeColor={theme.colors.types[type]}>
                <TypeText>{type}</TypeText>
              </TypeBadge>
            ))}
          </TypeBadgeContainer>

          {/* imagem principal do pokemon */}
          <PokemonImage 
            source={{ uri: pokemon.image }} 
            key={`pokemon-${pokemon.id}`}
            resizeMode="contain"
          />

          {/* card com informacoes basicas */}
          <InfoCard>
            <InfoRowHorizontal>
              <InfoColumn>
                <InfoValue>{formatHeight(pokemon.height)}</InfoValue>
                <InfoLabel>Height</InfoLabel>
              </InfoColumn>
              
              <InfoColumn>
                <InfoValue>{formatWeight(pokemon.weight)}</InfoValue>
                <InfoLabel>Weight</InfoLabel>
              </InfoColumn>
            </InfoRowHorizontal>

            {/* secao com estatisticas do pokemon */}
            <StatsSection>
              <StatsTitle>Base Stats</StatsTitle>
              {pokemon.stats.map((stat, index) => (
                <StatRow key={index}>
                  <StatName>{formatStatName(stat.name)}</StatName>
                  <StatBarContainer>
                    <StatBar>
                      <StatFill value={stat.value} />
                    </StatBar>
                    <StatValue>{stat.value}</StatValue>
                  </StatBarContainer>
                </StatRow>
              ))}
            </StatsSection>
          </InfoCard>
        </Content>
      </ShareableView>

      {/* botao de compartilhamento */}
      <ShareButton onPress={handleShare}>
        <ShareButtonText>Share Pokemon</ShareButtonText>
      </ShareButton>

      {/* modal com opcoes de compartilhamento */}
      {showShareOptions && (
        <ShareOptionsOverlay>
          <ShareOptionsContainer>
            <ShareOptionsTitle>Share Pokemon</ShareOptionsTitle>
            
            <ShareOptionButton onPress={handleShareImage}>
              <ShareOptionIcon>📸</ShareOptionIcon>
              <ShareOptionTextContainer>
                <ShareOptionText>Share as Image</ShareOptionText>
                <ShareOptionSubtext>Save Pokemon card to photos & share to any app</ShareOptionSubtext>
              </ShareOptionTextContainer>
            </ShareOptionButton>
            
            <ShareOptionButton onPress={handleShareLink}>
              <ShareOptionIcon>🔗</ShareOptionIcon>
              <ShareOptionTextContainer>
                <ShareOptionText>Share Pokemon Link</ShareOptionText>
                <ShareOptionSubtext>Share Pokemon page link to any app</ShareOptionSubtext>
              </ShareOptionTextContainer>
            </ShareOptionButton>
            
            <CancelButton onPress={handleCancelShare}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
          </ShareOptionsContainer>
        </ShareOptionsOverlay>
      )}
    </Container>
  );
};

// estilos dos componentes usando styled-components

// container principal da tela
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.typeColor || theme.colors.background};
`;

// cabecalho da tela com navegacao e titulo
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.xl}px ${theme.spacing.m}px ${theme.spacing.l}px;
  background-color: ${theme.colors.primary};
  border-bottom-width: 4px;
  border-bottom-color: black;
`;

// lado esquerdo do header com botao home
const HeaderLeft = styled.View`
  flex: 1;
`;

// centro do header com titulo e subtitulo
const HeaderCenter = styled.View`
  flex: 2;
  align-items: center;
`;

// lado direito do header com botoes de navegacao
const HeaderRight = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${theme.spacing.s}px;
`;

// botao generico do header
const HeaderButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.full}px;
`;

// texto dos botoes do header
const HeaderButtonText = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
`;

// botoes de navegacao entre pokemons
const NavButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.full}px;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

// texto dos botoes de navegacao
const NavButtonText = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
  color: ${props => props.disabled ? theme.colors.textSecondary : theme.colors.text};
`;

// titulo principal do header
const HeaderTitle = styled.Text`
  font-size: ${theme.textProp.sizes.xl}px;
  font-weight: ${theme.textProp.weights.bold};
  color: white;
  text-shadow-offset: 1px 1px;
  text-shadow-radius: 1px;
  text-shadow-color: black;
`;

// subtitulo do header
const HeaderSubtitle = styled.Text`
  font-size: ${theme.textProp.sizes.m}px;
  color: white;
  opacity: 0.9;
`;

// area de conteudo principal com scroll
const Content = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  showsVerticalScrollIndicator: false,
  nestedScrollEnabled: true,
})`
  flex: 1;
  padding: ${theme.spacing.m}px;
`;

// container para os badges dos tipos
const TypeBadgeContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${theme.spacing.s}px;
  margin-bottom: ${theme.spacing.l}px;
`;

// badge individual de cada tipo
const TypeBadge = styled.View`
  background-color: ${props => props.typeColor};
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.s}px ${theme.spacing.m}px;
`;

// texto do tipo no badge
const TypeText = styled.Text`
  font-size: ${theme.textProp.sizes.s}px;
  font-weight: ${theme.textProp.weights.medium};
  color: white;
  text-transform: capitalize;
`;

// imagem principal do pokemon
const PokemonImage = styled.Image`
  width: 300px;
  height: 300px;
  align-self: center;
  margin-bottom: -${theme.spacing.xxl}px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg}px;
  z-index: ${Platform.OS === 'android' ? 10 : 1};
  elevation: ${Platform.OS === 'android' ? 10 : 0};
`;

// card com informacoes do pokemon
const InfoCard = styled.View`
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.xl}px ${theme.spacing.l}px ${theme.spacing.l}px;
  margin-bottom: ${theme.spacing.l}px;
  shadow-color: ${theme.shadows.shadowColor};
  shadow-offset: ${theme.shadows.shadowOffset.width}px ${theme.shadows.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.shadowOpacity};
  shadow-radius: ${theme.shadows.shadowRadius}px;
  elevation: ${Platform.OS === 'android' ? 5 : theme.shadows.elevation};
  z-index: ${Platform.OS === 'android' ? 1 : 0};
`;

// linha de informacao basica
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.s}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// linha horizontal para height e weight
const InfoRowHorizontal = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: ${theme.spacing.l}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

// coluna para value/label vertical
const InfoColumn = styled.View`
  align-items: center;
  flex: 1;
`;

// label da informacao
const InfoLabel = styled.Text`
  font-size: ${theme.textProp.sizes.s}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
`;

// valor da informacao
const InfoValue = styled.Text`
  font-size: ${theme.textProp.sizes.xxl}px;
  font-weight: ${theme.textProp.weights.bold};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.xs}px;
`;

// secao das estatisticas
const StatsSection = styled.View`
  margin-top: ${theme.spacing.l}px;
`;

// titulo da secao de estatisticas
const StatsTitle = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
  font-weight: ${theme.textProp.weights.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.m}px;
`;

// linha de uma estatistica
const StatRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.s}px;
`;

// nome da estatistica
const StatName = styled.Text`
  font-size: ${theme.textProp.sizes.s}px;
  color: ${theme.colors.textSecondary};
  width: 80px;
`;

// container da barra de progresso
const StatBarContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.s}px;
`;

const StatBar = styled.View`
  flex: 1;
  height: 8px;
  background-color: ${theme.colors.border};
  border-radius: ${theme.borderRadius.full}px;
  overflow: hidden;
`;

const StatFill = styled.View`
  height: 100%;
  background-color: ${theme.colors.primary};
  width: ${props => Math.min((props.value / 255) * 100, 100)}%;
`;

// valor numerico da estatistica
const StatValue = styled.Text`
  font-size: ${theme.textProp.sizes.s}px;
  font-weight: ${theme.textProp.weights.medium};
  color: ${theme.colors.text};
  width: 30px;
  text-align: right;
`;

// botao principal de compartilhamento
const ShareButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.borderRadius.lg}px;
  align-items: center;
  margin: ${theme.spacing.m}px;
`;

// texto do botao de compartilhamento
const ShareButtonText = styled.Text`
  color: white;
  font-size: ${theme.textProp.sizes.m}px;
  font-weight: ${theme.textProp.weights.medium};
`;

const ShareableView = styled.View`
  flex: 1;
  background-color: ${props => props.typeColor || theme.colors.background};
`;

const ShareOptionsOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// container do modal de compartilhamento
const ShareOptionsContainer = styled.View`
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.l}px;
  margin: ${theme.spacing.m}px;
  width: 90%;
  max-width: 400px;
  shadow-color: ${theme.shadows.shadowColor};
  shadow-offset: ${theme.shadows.shadowOffset.width}px ${theme.shadows.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.shadowOpacity};
  shadow-radius: ${theme.shadows.shadowRadius}px;
  elevation: ${theme.shadows.elevation};
`;

// titulo do modal de compartilhamento
const ShareOptionsTitle = styled.Text`
  font-size: ${theme.textProp.sizes.xl}px;
  font-weight: ${theme.textProp.weights.bold};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.l}px;
`;

// botao de opcao de compartilhamento
const ShareOptionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.borderRadius.md}px;
  margin-bottom: ${theme.spacing.s}px;
  background-color: ${theme.colors.background};
  shadow-color: ${theme.shadows.shadowColor};
  shadow-offset: ${theme.shadows.shadowOffset.width}px ${theme.shadows.shadowOffset.height}px;
  shadow-opacity: ${theme.shadows.shadowOpacity};
  shadow-radius: ${theme.shadows.shadowRadius}px;
  elevation: ${theme.shadows.elevation};
`;

// icone da opcao de compartilhamento
const ShareOptionIcon = styled.Text`
  font-size: ${theme.textProp.sizes.xl}px;
  margin-right: ${theme.spacing.m}px;
  width: 30px;
  text-align: center;
`;

const ShareOptionTextContainer = styled.View`
  flex: 1;
`;

// texto principal da opcao
const ShareOptionText = styled.Text`
  font-size: ${theme.textProp.sizes.m}px;
  font-weight: ${theme.textProp.weights.medium};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
`;

// subtexto da opcao
const ShareOptionSubtext = styled.Text`
  font-size: ${theme.textProp.sizes.s}px;
  color: ${theme.colors.textSecondary};
`;

// botao de cancelar compartilhamento
const CancelButton = styled.TouchableOpacity`
  background-color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${theme.spacing.m}px;
`;

// texto do botao de cancelar
const CancelButtonText = styled.Text`
  color: white;
  font-size: ${theme.textProp.sizes.m}px;
  font-weight: ${theme.textProp.weights.medium};
`;

// container do estado de carregamento
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
`;

// texto de carregamento
const LoadingText = styled.Text`
  margin-top: ${theme.spacing.m}px;
  font-size: ${theme.textProp.sizes.l}px;
  color: ${theme.colors.textSecondary};
`;

// container do estado de erro
const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.xl}px;
`;

// texto de erro
const ErrorText = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: ${theme.spacing.l}px;
`;

// botao de tentar novamente
const RetryButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.m}px ${theme.spacing.xl}px;
  border-radius: ${theme.borderRadius.lg}px;
`;

// texto do botao de retry
const RetryText = styled.Text`
  color: white;
  font-size: ${theme.textProp.sizes.m}px;
  font-weight: ${theme.textProp.weights.medium};
`;

export default DetailsScreen;
