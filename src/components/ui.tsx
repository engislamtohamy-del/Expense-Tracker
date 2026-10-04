import { Pressable, StyleSheet, Text } from 'react-native';
import type { ReactNode } from 'react';

export const theme = { primary: '#4f46e5', border: '#d1d5db', muted: '#6b7280', bg: '#f9fafb' };

export function Button({
  children,
  onPress,
  disabled,
  variant = 'primary',
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, variant === 'secondary' && styles.secondary, disabled && { opacity: 0.4 }]}>
      <Text style={[styles.btnText, variant === 'secondary' && { color: theme.primary }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: theme.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
