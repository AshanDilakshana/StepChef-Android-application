import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.logo}>🍳 StepChef</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingBottom: 14,
    shadowColor: '#EA580C',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
});

export default Header;