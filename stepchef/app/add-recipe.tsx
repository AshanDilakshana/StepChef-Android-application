import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StepForm from '../components/StepForm';
import StepList from '../components/StepList';
import { saveRecipe } from '../utils/api';
import { StepInput } from '../utils/types';

const CATEGORIES = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Snack', 'Uncategorized'];

export default function AddRecipeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [steps, setSteps] = useState<StepInput[]>([]);
  const [addingStep, setAddingStep] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveStep = (step: StepInput) => {
    setSteps(prev => [...prev, { ...step, step_order: prev.length }]);
    setAddingStep(false);
  };

  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      Alert.alert('Missing Name', 'Please enter a recipe name.');
      return;
    }
    if (steps.length === 0) {
      Alert.alert('No Steps', 'Please add at least one step.');
      return;
    }
    setSaving(true);
    try {
      await saveRecipe(recipeName, category, steps);
      router.replace('/home');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save recipe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Recipe Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Name *</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="e.g. Butter Chicken"
          value={recipeName}
          onChangeText={setRecipeName}
          placeholderTextColor="#9CA3AF"
          autoFocus
        />
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
      </View>

      {/* Steps Added */}
      {steps.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Steps Added ({steps.length})</Text>
            <TouchableOpacity onPress={() => setAddingStep(true)} style={styles.addMoreBtn} activeOpacity={0.7}>
              <Ionicons name="add" size={14} color="#F97316" />
              <Text style={styles.addMoreText}>Add More</Text>
            </TouchableOpacity>
          </View>
          {/* Preview list (read-only) */}
          {steps.map((s, i) => (
            <View key={i} style={styles.stepPreview}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepPreviewTitle}>{s.title}</Text>
              {s.duration > 0 && (
                <Text style={styles.stepDuration}>{s.duration.toFixed(1)} min</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Add Step Form */}
      {addingStep && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {steps.length === 0 ? 'Step 1 — Get Started' : `Step ${steps.length + 1}`}
          </Text>
          <StepForm
            stepNumber={steps.length + 1}
            onSave={handleSaveStep}
            onCancel={() => (steps.length > 0 ? setAddingStep(false) : router.back())}
          />
        </View>
      )}

      {/* Save Recipe Button */}
      {!addingStep && steps.length > 0 && (
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSaveRecipe}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Save Recipe to Supabase</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  content: { padding: 16 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  nameInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
    color: '#1F2937',
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  picker: { height: Platform.OS === 'ios' ? 120 : 52, color: '#1F2937' },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addMoreText: { fontSize: 13, color: '#F97316', fontWeight: '600' },
  stepPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    marginBottom: 6,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  stepPreviewTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  stepDuration: { fontSize: 12, color: '#F97316', fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#F97316',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    marginTop: 4,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
