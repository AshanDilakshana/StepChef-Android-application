import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STORAGE_KEY = '@stepchef_custom_scales';
const DEFAULT_SCALES = ['tablespoon', 'teaspoon', 'ml', 'cup', 'liter', 'gram', 'kg', 'oz'];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scales, setScales] = useState<string[]>([]);
  const [newScale, setNewScale] = useState('');

  useEffect(() => {
    loadScales();
  }, []);

  const loadScales = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setScales(JSON.parse(stored));
      } else {
        setScales(DEFAULT_SCALES);
      }
    } catch (e) {
      console.error('Failed to load scales:', e);
    }
  };

  const saveScales = async (updatedScales: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScales));
      setScales(updatedScales);
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const handleAddScale = () => {
    const trimmed = newScale.trim().toLowerCase();
    if (!trimmed) return;

    if (scales.includes(trimmed)) {
      Alert.alert('Duplicate', 'This scale unit already exists.');
      return;
    }

    const updated = [...scales, trimmed];
    saveScales(updated);
    setNewScale('');
    Keyboard.dismiss();
  };

  const handleDeleteScale = (itemToDelete: string) => {
    const updated = scales.filter(s => s !== itemToDelete);
    saveScales(updated);
  };

  const handleReset = () => {
    Alert.alert('Reset to Defaults', 'Reset scales list to default units?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => saveScales(DEFAULT_SCALES) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.addSection}>
        <Text style={styles.label}>Add Custom Unit</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. ml 50, scoop, pinch"
            value={newScale}
            onChangeText={setNewScale}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddScale} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Measurement Units</Text>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text style={styles.resetText}>Reset Defaults</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={scales}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity onPress={() => handleDeleteScale(item)} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED', padding: 16 },
  addSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  addBtn: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  resetText: { fontSize: 13, color: '#F97316', fontWeight: '600' },
  listContent: { gap: 8 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  itemText: { fontSize: 15, color: '#374151', textTransform: 'capitalize', fontWeight: '500' },
});
