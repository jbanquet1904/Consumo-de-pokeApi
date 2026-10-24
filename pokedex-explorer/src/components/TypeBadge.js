import { View, Text, StyleSheet } from 'react-native';
import { typeColors } from '../theme/colors';
import { typeNames } from '../utils/translations';

export default function TypeBadge({ type }) {
  const backgroundColor = typeColors[type] ?? '#999999';
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{typeNames[type] ?? type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  text: { color: '#FFFFFF', fontWeight: 'bold' },
});