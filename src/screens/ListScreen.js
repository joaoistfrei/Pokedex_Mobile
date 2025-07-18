import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { pokemonService } from '../services/PokemonService';
import PokemonCard from '../components/PokemonCard';


const ListScreen = ({ navigation }) => {
  
    // estados para gerenciar a lista de pokemons, carregamento e erros
    const [pokemonList, setPokemonList] = useState([]);
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
        } catch (err) {
        console.error('Error fetching Pokemon list:', err);
        setError(err.message);
        Alert.alert('Error', 'Failed to load Pokemon list. Please try again.');
        } finally {
        setLoading(false);
        }
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
            <Title>Pokédex</Title>
            <Subtitle>{pokemonList.length} pokemon</Subtitle>
        </Header>
        
        <FlatList
            data={pokemonList}
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

// titulo principal "Pokédex" com efeito de sombra p simular um contorno kkkkkk
const Title = styled.Text`
  font-size: 70px;
  font-weight: ${theme.textProp.weights.bold};
  color: white;
  text-align: center;
  margin-bottom: ${theme.spacing.xs}px;
  text-shadow-offset: 2px 2px;
  text-shadow-radius: 2px;
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

export default ListScreen;
