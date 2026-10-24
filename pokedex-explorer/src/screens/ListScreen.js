import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import StatusView from '../components/StatusView';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { colors } from '../theme/colors';

export default function ListScreen({ onSelectPokemon }) {
  // Concept: useState for the controlled TextInput
  const [query, setQuery] = useState('');

  const { pokemons, loading, loadingMore, error, loadMore, retry } = usePokemonList();
  const {
    search,
    searching,
    error: searchError,
    notFoundQuery,
    clearSearch,
  } = usePokemonSearch(onSelectPokemon);

  // Typing again hides the previous "not found" or error message
  const handleChangeText = (text) => {
    setQuery(text);
    clearSearch();
  };

  const handleSearch = () => search(query);

  // Indicator at the end of the list while loading more (infinite scroll)
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.footerText}>Cargando más Pokémon...</Text>
        </View>
      );
    }
    if (error) {
      return <StatusView status="error" message={error} onRetry={retry} />;
    }
    return null;
  };

  // Concept: UI states -> decides what the user sees
  const renderContent = () => {
    if (searching) {
      return <StatusView status="loading" message="Buscando Pokémon..." />;
    }
    if (searchError) {
      return <StatusView status="error" message={searchError} onRetry={handleSearch} />;
    }
    if (notFoundQuery) {
      return (
        <StatusView
          status="empty"
          message={`No encontramos ningún Pokémon con "${notFoundQuery}". Revisa el nombre o número.`}
        />
      );
    }
    if (loading) {
      return <StatusView status="loading" message="Cargando Pokémon..." />;
    }
    if (error && pokemons.length === 0) {
      return <StatusView status="error" message={error} onRetry={retry} />;
    }

    // Concept: FlatList for long lists (numColumns, keyExtractor, onEndReached)
    return (
      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={onSelectPokemon} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      <SearchBar
        value={query}
        onChangeText={handleChangeText}
        onSearch={handleSearch}
        disabled={searching}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: colors.background },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: { paddingVertical: 16, alignItems: 'center', gap: 6 },
  footerText: { color: colors.textSecondary },
});