import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// Concept: UI states -> loading, error, empty
export default function StatusView({ status, message, onRetry }) {
  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" color={colors.primary} />}
      <Text style={styles.message}>{message}</Text>
      {status === 'error' && onRetry && (
        <Button title="Reintentar" onPress={onRetry} color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  message: { fontSize: 16, color: colors.text, textAlign: 'center' },
});