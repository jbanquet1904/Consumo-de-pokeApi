import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native';
import StatusView from '../components/StatusView';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { colors } from '../theme/colors';
import { formatNumber, capitalize } from '../utils/formatters';

export default function DetailScreen({ pokemonId, onBack }) {
  const { pokemon, loading, error, notFound, retry } = usePokemonDetail(pokemonId);

  // Concept: UI states -> loading, error, empty, success
  const renderContent = () => {
    if (loading) {
      return <StatusView status="loading" message="Cargando ficha del Pokémon..." />;
    }
    if (error) {
      return <StatusView status="error" message={error} onRetry={retry} />;
    }
    if (notFound) {
      return <StatusView status="empty" message="Este Pokémon no existe." />;
    }

    return (
      <ScrollView contentContainerStyle={styles.content}>
        {/* Concept: remote Image with explicit width and height */}
        {pokemon.image && <Image source={{ uri: pokemon.image }} style={styles.image} />}
        <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

        <View style={styles.types}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </View>

        <View style={styles.measures}>
          <View style={styles.measure}>
            <Text style={styles.measureValue}>{pokemon.height} m</Text>
            <Text style={styles.measureLabel}>Altura</Text>
          </View>
          <View style={styles.measure}>
            <Text style={styles.measureValue}>{pokemon.weight} kg</Text>
            <Text style={styles.measureLabel}>Peso</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Estadísticas base</Text>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <View style={styles.backButton}>
        <Button title="Volver a la lista" onPress={onBack} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { alignItems: 'center', padding: 16 },
  image: { width: 220, height: 220 },
  number: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
  name: { fontSize: 30, fontWeight: 'bold', color: colors.text },
  types: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  measures: { flexDirection: 'row', gap: 40, marginBottom: 16 },
  measure: { alignItems: 'center' },
  measureValue: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  measureLabel: { color: colors.textSecondary },
  statsCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  backButton: { padding: 12 },
});