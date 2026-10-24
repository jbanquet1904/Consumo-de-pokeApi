import { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import { colors } from './src/theme/colors';

export default function App() {
  // Concept: useState to switch views without a navigation library
  // null = list view, a number = detail view of that Pokémon
  const [selectedPokemonId, setSelectedPokemonId] = useState(null);
  const isDetailOpen = selectedPokemonId !== null;

  return (
    // Concept: SafeAreaView keeps content away from the notch and status bar
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.screen}>
          {/* The list always stays mounted to keep loaded Pokémon and scroll position */}
          <ListScreen onSelectPokemon={setSelectedPokemonId} />

          {/* The detail is drawn on top of the list, covering it completely */}
          {isDetailOpen && (
            <View style={styles.overlay}>
              <DetailScreen
                pokemonId={selectedPokemonId}
                onBack={() => setSelectedPokemonId(null)}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
});