import { Tabs } from 'expo-router';
import { theme } from '../../components/ui.tsx';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.primary }}>
      <Tabs.Screen name="index" options={{ title: 'Add Expense', tabBarLabel: 'Add' }} />
      <Tabs.Screen name="report" options={{ title: 'Report' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
    </Tabs>
  );
}
