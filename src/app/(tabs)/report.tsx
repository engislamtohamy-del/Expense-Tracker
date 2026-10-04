import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { DateField } from '../../components/DateField.tsx';
import { theme } from '../../components/ui.tsx';
import { addMonths, dateLabel, monthLabel, monthRange, today } from '../../lib/dates.ts';
import { buildReport, formatMoney } from '../../lib/report.ts';
import { useStore } from '../../lib/store.tsx';

type Mode = 'month' | 'period';

export default function ReportScreen() {
  const { expenses, categories, deleteExpense } = useStore();
  const [mode, setMode] = useState<Mode>('month');
  const [month, setMonth] = useState(() => new Date());
  const [from, setFrom] = useState(() => monthRange(new Date()).from);
  const [to, setTo] = useState(today());

  const range = mode === 'month' ? monthRange(month) : { from, to };
  const invalid = range.from > range.to;
  const report = useMemo(
    () => (invalid ? buildReport([], categories, range.from, range.to) : buildReport(expenses, categories, range.from, range.to)),
    [expenses, categories, range.from, range.to, invalid],
  );
  const catName = (id: string) => categories.find((c) => c.id === id);

  const header = (
    <View>
      <View style={styles.modes}>
        {(['month', 'period'] as Mode[]).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[styles.mode, mode === m && styles.modeOn]}>
            <Text style={[styles.modeText, mode === m && { color: '#fff' }]}>
              {m === 'month' ? 'Month' : 'Custom period'}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === 'month' ? (
        <View style={styles.monthNav}>
          <Pressable onPress={() => setMonth(addMonths(month, -1))} hitSlop={12}>
            <Text style={styles.arrow}>‹</Text>
          </Pressable>
          <Pressable onPress={() => setMonth(new Date())}>
            <Text style={styles.monthTitle}>{monthLabel(month)}</Text>
          </Pressable>
          <Pressable onPress={() => setMonth(addMonths(month, 1))} hitSlop={12}>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <DateField label="From" value={from} onChange={setFrom} />
          <DateField label="To" value={to} onChange={setTo} />
          {invalid && <Text style={styles.err}>"From" must be on or before "To".</Text>}
        </View>
      )}

      <View style={styles.totalBox}>
        <Text style={{ color: theme.muted }}>Total ({report.count} expenses)</Text>
        <Text style={styles.total}>{formatMoney(report.total)}</Text>
      </View>

      {report.byCategory.map((c) => (
        <View key={c.categoryId} style={{ marginBottom: 10 }}>
          <View style={styles.catRow}>
            <Text style={styles.catName}>{c.name}</Text>
            <Text>
              {formatMoney(c.total)} · {report.total ? Math.round((c.total / report.total) * 100) : 0}%
            </Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.bar, { backgroundColor: c.color, width: `${(c.total / report.total) * 100}%` }]} />
          </View>
        </View>
      ))}

      <Text style={styles.section}>Expenses</Text>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.page}
      data={report.expenses}
      keyExtractor={(e) => e.id}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={{ color: theme.muted }}>No expenses in this period.</Text>}
      renderItem={({ item }) => {
        const cat = catName(item.categoryId);
        return (
          <View style={styles.item}>
            <View style={[styles.dot, { backgroundColor: cat?.color ?? '#9ca3af' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{cat?.name ?? 'Uncategorized'}</Text>
              <Text style={{ color: theme.muted }}>
                {dateLabel(item.date)}
                {item.note ? ` · ${item.note}` : ''}
              </Text>
            </View>
            <Text style={styles.amount}>{formatMoney(item.amount)}</Text>
            <Pressable onPress={() => deleteExpense(item.id)} hitSlop={8}>
              <Text style={{ color: '#dc2626', fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  page: { padding: 16 },
  modes: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  mode: { flex: 1, borderWidth: 1, borderColor: theme.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  modeOn: { backgroundColor: theme.primary },
  modeText: { color: theme.primary, fontWeight: '600' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  arrow: { fontSize: 36, color: theme.primary, paddingHorizontal: 12 },
  monthTitle: { fontSize: 20, fontWeight: '700' },
  err: { color: '#dc2626' },
  totalBox: { alignItems: 'center', marginVertical: 16 },
  total: { fontSize: 34, fontWeight: '800' },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catName: { fontWeight: '600' },
  barBg: { height: 8, borderRadius: 4, backgroundColor: '#e5e7eb' },
  bar: { height: 8, borderRadius: 4 },
  section: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: theme.border },
  dot: { width: 12, height: 12, borderRadius: 6 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 16, fontWeight: '600' },
});
