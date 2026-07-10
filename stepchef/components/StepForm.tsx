import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StepInput } from '../utils/types';
import { formatTime } from '../utils/timeUtils';

type StepFormProps = {
  stepNumber: number;
  onSave: (step: StepInput) => void;
  onCancel: () => void;
};

const STORAGE_KEY = '@stepchef_custom_scales';
const DEFAULT_SCALES = ['tablespoon', 'teaspoon', 'ml', 'cup', 'liter', 'gram', 'kg', 'oz'];

const StepForm = ({ stepNumber, onSave, onCancel }: StepFormProps) => {
  const [scales, setScales] = useState<string[]>(DEFAULT_SCALES);
  const [form, setForm] = useState<StepInput>({
    title: '',
    ingredients: '',
    scale: 'tablespoon',
    quantity: 1,
    start_time: null,
    end_time: null,
    duration: 0,
    step_order: stepNumber - 1,
  });

  useEffect(() => {
    loadScales();
  }, []);

  const loadScales = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setScales(parsed);
        if (parsed.length > 0) {
          setForm(f => ({ ...f, scale: parsed[0] }));
        }
      }
    } catch (e) {
      console.error('Failed to load custom scales in StepForm:', e);
    }
  };

  const handleStart = () => {
    const now = new Date().toISOString();
    setForm(f => ({ ...f, start_time: now }));
  };

  const handleEnd = () => {
    const now = new Date();
    const nowISO = now.toISOString();
    if (form.start_time) {
      const diffMs = now.getTime() - new Date(form.start_time).getTime();
      const diffMin = diffMs / 60000;
      setForm(f => ({ ...f, end_time: nowISO, duration: Math.max(0.1, parseFloat(diffMin.toFixed(2))) }));
    } else {
      setForm(f => ({ ...f, end_time: nowISO }));
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Please enter a step title.');
      return;
    }
    onSave(form);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.stepLabel}>Step {stepNumber}</Text>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Step Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chop onions"
          value={form.title}
          onChangeText={t => setForm(f => ({ ...f, title: t }))}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Ingredients */}
      <View style={styles.field}>
        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="e.g. 2 onions, garlic cloves..."
          value={form.ingredients}
          onChangeText={t => setForm(f => ({ ...f, ingredients: t }))}
          multiline
          numberOfLines={3}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
      </View>

      {/* Quantity + Scale */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            value={form.quantity ? String(form.quantity) : ''}
            onChangeText={t => setForm(f => ({ ...f, quantity: parseFloat(t) || 0 }))}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <View style={[styles.field, { flex: 2 }]}>
          <Text style={styles.label}>Scale</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.scale}
              onValueChange={v => setForm(f => ({ ...f, scale: v }))}
              style={styles.picker}
            >
              {scales.map(s => (
                <Picker.Item key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={s} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Timing */}
      <View style={styles.field}>
        <Text style={styles.label}>Timing (stopwatch)</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeDisplay}>
            <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
            <Text style={styles.timeText}>
              {form.start_time ? formatTime(form.start_time) : '--:--'}
            </Text>
          </View>
          <TouchableOpacity style={styles.timeBtn} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.timeBtnText}>Start</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.timeRow, { marginTop: 8 }]}>
          <View style={styles.timeDisplay}>
            <Ionicons name="timer-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
            <Text style={styles.timeText}>
              {form.end_time ? formatTime(form.end_time) : '--:--'}
            </Text>
          </View>
          <TouchableOpacity style={styles.timeBtn} onPress={handleEnd} activeOpacity={0.8}>
            <Text style={styles.timeBtnText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Duration Input */}
      <View style={styles.field}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter step duration in minutes"
          value={form.duration ? String(form.duration) : ''}
          onChangeText={t => {
            const clean = t.replace(/[^0-9.]/g, '');
            const parsed = parseFloat(clean) || 0;
            setForm(f => ({ ...f, duration: parsed }));
          }}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.saveBtnText}>Save Step</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  stepLabel: { fontSize: 18, fontWeight: '700', color: '#F97316', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  textarea: { minHeight: 80 },
  row: { flexDirection: 'row' },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  picker: { height: Platform.OS === 'ios' ? 120 : 50, color: '#1F2937' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 11,
  },
  timeText: { fontSize: 14, color: '#374151' },
  timeBtn: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  timeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  duration: { marginTop: 8, fontSize: 13, color: '#F97316', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 24 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default StepForm;