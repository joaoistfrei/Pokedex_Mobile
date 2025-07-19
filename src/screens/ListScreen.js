import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { pokemonService } from '../services/PokemonService';
import PokemonCard from '../components/PokemonCard';


const ListScreen = ({ navigation }) => {
  
    // estados para gerenciar a lista de pokemons, carregamento e erros
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // hook executado quando o componente é montado
    useEffect(() => {
        fetchPokemonList();
    }, []);

    
    // função responsável por buscar a lista completa de pokemon
    // 1- primeiro busca a lista basica
    // 2- depois busca os detalhes de cada pokemon para obter os tipos (para poder botar a cor do card e os elementos de cada pokemon)
    const fetchPokemonList = async () => {
        try {
        setLoading(true);
        setError(null);
        
        // busca a lista básica de pokemon
        const basicList = await pokemonService.fetchPokemonList();
        
        // busca os detalhes de cada pokemon para obter os tipos
        const detailedList = await Promise.all(
            basicList.map(async (pokemon) => {
            try {
                const details = await pokemonService.fetchPokemonDetails(pokemon.id);
                return {
                ...pokemon,
                types: details.types,
                };
            } catch (err) {
                console.error(`Error fetching details for ${pokemon.name}:`, err);
                return {
                ...pokemon,
                types: ['normal'], // tipo padrao em caso de erro
                };
            }
            })
        );
        
        setPokemonList(detailedList);
        setFilteredPokemon(detailedList);
        } catch (err) {
        console.error('Error fetching Pokemon list:', err);
        setError(err.message);
        Alert.alert('Error', 'Failed to load Pokemon list. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    // funcao para filtrar pokemons com base no termo de pesquisa
    const handleSearch = (text) => {
        setSearchTerm(text);
        
        if (text === '') {
            setFilteredPokemon(pokemonList);
        } else {
            const filtered = pokemonList.filter(pokemon =>
                pokemon.name.toLowerCase().includes(text.toLowerCase()) ||
                pokemon.id.toString().includes(text)
            );
            setFilteredPokemon(filtered);
        }
    };

    // limpar pesquisa
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredPokemon(pokemonList);
    };

    // funcao chamada quando um card de pokemon é pressionado
    // navega para a tela de detalhes do pokemon selecionado

    const handlePokemonPress = (pokemonId, pokemonName) => {
        navigation.navigate('Details', { pokemonId, pokemonName });
    };

    
    // funcao que renderiza cada item da lista (card de pokemon)
    // Usada pelo FlatList p renderizar cada pokemon
    
    const renderPokemonCard = ({ item }) => (
        <PokemonCard pokemon={item} onPress={handlePokemonPress} />
    );

    // renderiza tela de carregamento enquanto os dados estão sendo buscados
    if (loading) {
        return (
        <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <LoadingText>Loading Pokédex...</LoadingText>
        </LoadingContainer>
        );
    }

    // renderiza tela de erro caso algo de errado no carregamento
    if (error) {
        return (
        <ErrorContainer>
            <ErrorText>Failed to load Pokédex</ErrorText>
            <RetryButton onPress={fetchPokemonList}>
            <RetryText>Retry</RetryText>
            </RetryButton>
        </ErrorContainer>
        );
    }

    // renderiza a tela principal com o cabecalho e a lista de pokemon
    return (
        <Container>
        <Header>
            <TitleContainer>
                <PokeballImage source={require('../../images/pokeball.png')} />
                <Title>Pokédex</Title>
                <PokeballImage source={require('../../images/pokeball.png')} />
            </TitleContainer>
            <Subtitle>{filteredPokemon.length} pokémon</Subtitle>
        </Header>
        
        <SearchContainer>
            <SearchInput
                placeholder="Search Pokemon by name or id:"
                placeholderTextColor={theme.colors.textSecondary}
                value={searchTerm}
                onChangeText={handleSearch}
            />
            {searchTerm !== '' && (
                <ClearButton onPress={clearSearch}>
                    <ClearButtonText>✕</ClearButtonText>
                </ClearButton>
            )}
        </SearchContainer>
        
        <FlatList
            data={filteredPokemon}
            renderItem={renderPokemonCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: theme.spacing.m }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
        />
        </Container>
    );
    };

// container principal da tela
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// cabecalho da tela com titulo e contador de pokemon
const Header = styled.View`
  padding: ${theme.spacing.xl}px ${theme.spacing.m}px ${theme.spacing.l}px ${theme.spacing.m}px;
  background-color: ${theme.colors.primary};
  align-items: center;
  border-bottom-width: 4px;
  border-bottom-color: black;
`;

// container horizontal para titulo com pokeballs
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.xs}px;
`;

// imagem da pokeball nos lados do titulo
const PokeballImage = styled.Image`
  width: 40px;
  height: 40px;
  margin: 0 ${theme.spacing.m}px;
  opacity: 0.9;
`;

// titulo principal "Pokédx" com efeito de sombra p simular um contorno kkkkkk
const Title = styled.Text`
  font-size: ${theme.textProp.sizes.title}px;
  font-weight: ${theme.textProp.weights.bold};
  color: white;
  text-align: center;
  text-shadow-offset: 1px 1px;
  text-shadow-radius: 1px;
  text-shadow-color: black;
`;

// subtitulo que mostra o numero total de pokemon
const Subtitle = styled.Text`
  font-size: ${theme.textProp.sizes.m}px;
  color: white;
  opacity: 0.9;
`;

// container para o estado de carregamento
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
`;

// texto exibido durante o carregamento
const LoadingText = styled.Text`
  margin-top: ${theme.spacing.m}px;
  font-size: ${theme.textProp.sizes.l}px;
  color: ${theme.colors.textSecondary};
`;

// container para o estado de erro
const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.xl}px;
`;

// texto de erro exibido quando tem algum erro
const ErrorText = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: ${theme.spacing.l}px;
`;

// botao p tentar carregar novamente em caso de erro
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

// container para a barra de pesquisa
const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${theme.spacing.m}px;
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.lg}px;
  border-width: 2px;
  border-color: ${theme.colors.primary};
  padding: ${theme.spacing.s}px;
`;

// input de pesquisa
const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${theme.textProp.sizes.m}px;
  color: ${theme.colors.text};
  padding: ${theme.spacing.s}px;
`;

// botao para limpar pesquisa
const ClearButton = styled.TouchableOpacity`
  padding: ${theme.spacing.s}px;
  margin-left: ${theme.spacing.s}px;
`;

// texto do botao limpar
const ClearButtonText = styled.Text`
  font-size: ${theme.textProp.sizes.l}px;
  color: ${theme.colors.textSecondary};
`;

export default ListScreen;
