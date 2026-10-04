import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, theme } from '../../components/ui.tsx';
import { PALETTE, useStore } from '../../lib/store.tsx';

function notify(msg: string) {
  if (Platform.OS === 'web') window.alert(msg);
  else Alert.alert(msg);
}

export default function Categories() {
  const { categories, expenses, addCategory, updateCategory, deleteCategory } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]);

  const reset = () => {
    setEditingId(null);
    setName('');
    setColor(PALETTE[0]);
  };

  const duplicate = categories.some(
    (c) => c.id !== editingId && c.name.toLowerCase() === name.trim().toLowerCase(),
  );
  const valid = name.trim().length > 0 && !duplicate;

  const submit = () => {
    if (!valid) return;
    if (editingId) updateCategory(editingId, name, color);
    else addCategory(name, color);
    reset();
  };

  const remove = (id: string) => {
    if (!deleteCategory(id)) notify('This category has expenses and cannot be deleted.');
    else if (editingId === id) reset();
  };

  return (
    <FlatList
      contentContainerStyle={styles.page}
      data={categories}
      keyExtractor={(c) => c.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.form}>
          <Text style={styles.title}>{editingId ? 'Edit category' : 'New category'}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Category name" />
          {duplicate && <Text style={styles.err}>A category with this name already exists.</Text>}
          <View style={styles.palette}>
            {PALETTE.map((p) => (
              <Pressable
                key={p}
                onPress={() => setColor(p)}
                style={[styles.swatch, { backgroundColor: p }, p === color && styles.swatchOn]}
              />
            ))}
          </View>
          <Button onPress={submit} disabled={!valid}>
            {editingId ? 'Save changes' : 'Add category'}
          </Button>
          {editingId && (
            <View style={{ marginTop: 8 }}>
              <Button variant="secondary" onPress={reset}>
                Cancel
              </Button>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={{ color: theme.muted }}>No categories yet.</Text>}
      renderItem={({ item }) => {
        const count = expenses.filter((e) => e.categoryId === item.id).length;
        return (
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.name}>
              {item.name} <Text style={{ color: theme.muted }}>({count})</Text>
            </Text>
            <Pressable
              onPress={() => {
                setEditingId(item.id);
                setName(item.name);
                setColor(item.color);
              }}>
              <Text style={styles.link}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => remove(item.id)}>
              <Text style={[styles.link, { color: '#dc2626' }]}>Delete</Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  form: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 16, marginVertical: 8, backgroundColor: '#fff' },
  err: { color: '#dc2626', marginBottom: 6 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: 'transparent' },
  swatchOn: { borderColor: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border },
  dot: { width: 16, height: 16, borderRadius: 8 },
  name: { flex: 1, fontSize: 16 },
  link: { color: theme.primary, fontSize: 15, fontWeight: '600' },
});
