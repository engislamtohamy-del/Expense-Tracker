import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Category } from '../lib/types.ts';

export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.wrap}>
      {categories.map((c) => {
        const on = c.id === selected;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[styles.chip, { borderColor: c.color }, on && { backgroundColor: c.color }]}>
            <Text style={[styles.text, on && { color: '#fff' }]}>{c.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  chip: { borderWidth: 2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  text: { fontSize: 15, color: '#111827' },
});
