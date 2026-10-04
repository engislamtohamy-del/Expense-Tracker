import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryChips } from '../../components/CategoryChips.tsx';
import { DateField } from '../../components/DateField.tsx';
import { Button, theme } from '../../components/ui.tsx';
import { today } from '../../lib/dates.ts';
import { parseAmount } from '../../lib/report.ts';
import { useStore } from '../../lib/store.tsx';

export default function AddExpense() {
  const { categories, addExpense } = useStore();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today());
  const [saved, setSaved] = useState(false);

  const amount = parseAmount(amountText);
  const valid = amount !== null && categoryId !== null && categories.some((c) => c.id === categoryId);

  const save = () => {
    if (!valid) return;
    addExpense({ categoryId, amount, date, note: note.trim() || undefined });
    setAmountText('');
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Category</Text>
      {categories.length === 0 ? (
        <Text style={{ color: theme.muted }}>Create a category first in the Categories tab.</Text>
      ) : (
        <CategoryChips categories={categories} selected={categoryId} onSelect={setCategoryId} />
      )}

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amountText}
        onChangeText={setAmountText}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />

      <DateField label="Date" value={date} onChange={setDate} />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="e.g. Lunch" />

      <View style={{ marginTop: 20 }}>
        <Button onPress={save} disabled={!valid}>
          Save expense
        </Button>
        {saved && <Text style={styles.ok}>Saved ✓</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 12, fontSize: 18, marginTop: 6, backgroundColor: '#fff' },
  ok: { textAlign: 'center', marginTop: 10, color: '#16a34a', fontSize: 16 },
});
