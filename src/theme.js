import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const theme = {


    colors: {
        primary: '#d30b0bff',
        background: '#f77979ff',
        card: '#FFFFFF',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        shadow: '#000000',
        
        // Respective color for each Pokémon's element type
        types: {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC',
        },
        
        pastelTypes: {
            normal:   '#e0e0d1',
            fire:     '#ffd1b3',
            water:    '#b3d1ff',
            electric: '#fff7b3',
            grass:    '#c6f7c6',
            ice:      '#b3e6ff',
            fighting: '#e6b3b3',
            poison:   '#e6b3e6',
            ground:   '#e6d8b3',
            flying:   '#c6e6ff',
            psychic:  '#ffb3e6',
            bug:      '#e6ffb3',
            rock:     '#e6d1b3',
            ghost:    '#d1b3e6',
            dragon:   '#b3b8ff',
            dark:     '#cccccc',
            steel:    '#b3c6e6',
            fairy:    '#ffb3d9',
        },

        // Status colors for UI feedback
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
    },
    
    spacing: {
        xs: Platform.OS === 'ios' ? 4 : 3,
        s: Platform.OS === 'ios' ? 8 : 7,
        m: Platform.OS === 'ios' ? 16 : 14,
        l: Platform.OS === 'ios' ? 24 : 22,
        xl: Platform.OS === 'ios' ? 32 : 30,
        xxl: Platform.OS === 'ios' ? 48 : 44,
    },

    textProp: {
        sizes: {
            xxs: Platform.OS === 'ios' ? 8 : 7,
            xs: Platform.OS === 'ios' ? 12 : 11,
            s: Platform.OS === 'ios' ? 14 : 13,
            m: Platform.OS === 'ios' ? 16 : 15,
            l: Platform.OS === 'ios' ? 18 : 17,
            xl: Platform.OS === 'ios' ? 20 : 19,
            xxl: Platform.OS === 'ios' ? 28 : 26,
            title: Platform.OS === 'ios' ? 60 : 40,
        },
        weights: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: Platform.OS === 'ios' ? '700' : '800',
        },
        families: {
            regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
            title: Platform.OS === 'ios' ? 'System' : 'Roboto',
            body: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
    },

    // Add responsive scaling for better cross-platform consistency
    responsive: {
        scale: width / 375, // iPhone 6 as base (375px width)
        width,
        isSmallScreen: width < 375,
        isLargeScreen: width > 414,
    },

    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 999,
    },

    shadows: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
};