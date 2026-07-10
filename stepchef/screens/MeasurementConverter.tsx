// screens/MeasurementConverter.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const UNITS = ['ml', 'cup', 'l', 'tablespoon', 'teaspoon'];

const toMl: Record<string, number> = {
  ml: 1,
  cup: 240,
  l: 1000,
  tablespoon: 15,
  teaspoon: 5,
};

const MeasurementConverter = () => {
  const [quantity, setQuantity] = useState('');
  const [fromUnit, setFromUnit] = useState('ml');
  const [toUnit, setToUnit] = useState('cup');
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const val = parseFloat(quantity);
    if (isNaN(val)) { setResult('Enter a valid number'); return; }
    const ml = val * (toMl[fromUnit] ?? 1);
    const converted = ml / (toMl[toUnit] ?? 1);
    setResult(`${converted.toFixed(3).replace(/\.?0+$/, '')} ${toUnit}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="swap-horizontal-outline" size={18} color="#F97316" />
        <Text style={styles.cardTitle}>Measurement Converter</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.pickerRow}>
        <View style={styles.pickerBox}>
          <Text style={styles.pickerLabel}>From</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={fromUnit} onValueChange={setFromUnit} style={styles.picker}>
              {UNITS.map(u => <Picker.Item key={u} label={u} value={u} />)}
            </Picker>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#9CA3AF" style={styles.arrow} />
        <View style={styles.pickerBox}>
          <Text style={styles.pickerLabel}>To</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={toUnit} onValueChange={setToUnit} style={styles.picker}>
              {UNITS.map(u => <Picker.Item key={u} label={u} value={u} />)}
            </Picker>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={convert} activeOpacity={0.8}>
        <Ionicons name="calculator-outline" size={16} color="#fff" />
        <Text style={styles.btnText}>Convert</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.result}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#F97316',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 11,
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 12,
  },
  pickerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  pickerBox: { flex: 1 },
  pickerLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  pickerWrap: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#F9FAFB', overflow: 'hidden' },
  picker: { height: 48 },
  arrow: { marginHorizontal: 8, marginTop: 18 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F97316',
    borderRadius: 10,
    padding: 12,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  result: {
    marginTop: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
  },
  resultText: { fontSize: 18, fontWeight: '700', color: '#C2410C' },
});

export default MeasurementConverter;