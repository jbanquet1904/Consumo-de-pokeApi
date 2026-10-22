import { View, TextInput, Button, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Controlled input: the screen owns the text (value + onChangeText)
export default function SearchBar({ value, onChangeText, onSearch, disabled }) {
  return (
    <View style={styles.container}>
      {/* Concept: TextInput without autocapitalize or autocorrect */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Busca por nombre o número..."
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <Button title="Buscar" onPress={onSearch} disabled={disabled} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});