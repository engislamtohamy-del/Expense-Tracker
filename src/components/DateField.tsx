import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createElement } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { dateLabel, fromISODate, toISODate } from '../lib/dates.ts';

type Props = { label: string; value: string; onChange: (iso: string) => void };

export function DateField({ label, value, onChange }: Props) {
  const date = fromISODate(value);

  let control;
  if (Platform.OS === 'web') {
    control = createElement('input', {
      type: 'date',
      value,
      onChange: (e: { target: { value: string } }) => e.target.value && onChange(e.target.value),
      style: { fontSize: 16, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' },
    });
  } else if (Platform.OS === 'android') {
    control = (
      <Pressable
        style={styles.button}
        onPress={() =>
          DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            onChange: (_, d) => d && onChange(toISODate(d)),
          })
        }>
        <Text style={styles.buttonText}>{dateLabel(value)}</Text>
      </Pressable>
    );
  } else {
    control = (
      <DateTimePicker
        value={date}
        mode="date"
        display="compact"
        onChange={(_, d) => d && onChange(toISODate(d))}
      />
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6 },
  label: { fontSize: 16, color: '#6b7280' },
  button: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  buttonText: { fontSize: 16, color: '#111827' },
});
