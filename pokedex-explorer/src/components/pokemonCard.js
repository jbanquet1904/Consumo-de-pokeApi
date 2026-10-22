import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { formatNumber, capitalize } from '../utils/formatters';

export default function PokemonCard({ pokemon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon.id)}>
      {/* Concept: remote Image needs explicit width and height */}
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.number}>{formatNumber(pokemon.id)}</Text>
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 10,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  image: { width: 100, height: 100 },
  number: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  name: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
});