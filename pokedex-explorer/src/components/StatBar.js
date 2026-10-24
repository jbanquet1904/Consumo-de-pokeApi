import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { statNames } from '../utils/translations';

const MAX_STAT = 255;

export default function StatBar({ name, value }) {
  // Proportional width: value / 255
  const widthPercent = `${(value / MAX_STAT) * 100}%`;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{statNames[name] ?? name}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: widthPercent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  label: { width: 80, color: colors.textSecondary },
  value: { width: 36, fontWeight: 'bold', color: colors.text },
  track: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4 },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
});