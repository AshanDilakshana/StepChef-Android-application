import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StepList from '../../components/StepList';
import { getRecipeById } from '../../utils/api';
import { Recipe } from '../../utils/types';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStepId, setActiveStepId] = useState<string | undefined>();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (id) {
      getRecipeById(id)
        .then(r => {
          setRecipe(r);
          if (r) navigation.setOptions({ title: r.name });
        })
        .catch(() => Alert.alert('Error', 'Recipe not found.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleStart = () => {
    if (!recipe || recipe.steps.length === 0) return;
    setStarted(true);
    setActiveStepId(recipe.steps[0].id);
    setCompletedSteps([]);
  };

  const handleStepStart = (stepId: string) => setActiveStepId(stepId);
  const handleStepPause = () => setActiveStepId(undefined);

  const handleStepComplete = () => {
    if (!recipe || !activeStepId) return;
    const newCompleted = [...completedSteps, activeStepId];
    setCompletedSteps(newCompleted);
    const currentIdx = recipe.steps.findIndex(s => s.id === activeStepId);
    const nextStep = recipe.steps[currentIdx + 1];
    if (nextStep) {
      setActiveStepId(nextStep.id);
    } else {
      setActiveStepId(undefined);
    }
  };

  const allDone = recipe ? completedSteps.length === recipe.steps.length && recipe.steps.length > 0 : false;
  const totalMinutes = recipe ? recipe.steps.reduce((sum, s) => sum + (s.duration || 0), 0) : 0;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Recipe not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Recipe Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="pricetag-outline" size={13} color="#F97316" />
            <Text style={styles.metaText}>{recipe.category}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="list-outline" size={13} color="#F97316" />
            <Text style={styles.metaText}>{recipe.steps.length} steps</Text>
          </View>
          {totalMinutes > 0 && (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={13} color="#F97316" />
              <Text style={styles.metaText}>{totalMinutes.toFixed(0)} min total</Text>
            </View>
          )}
        </View>
      </View>

      {/* All Done Banner */}
      {allDone && (
        <View style={styles.doneBanner}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <View>
            <Text style={styles.doneTitle}>All Done!</Text>
            <Text style={styles.doneSubtitle}>Your recipe is ready to serve!</Text>
          </View>
        </View>
      )}

      {/* Active Step Highlight */}
      {activeStepId && !allDone && (
        <View style={styles.activeCard}>
          <Text style={styles.activeLabel}>Currently Cooking</Text>
          <Text style={styles.activeStepName}>
            {recipe.steps.find(s => s.id === activeStepId)?.title}
          </Text>
          <Text style={styles.activeProgress}>
            Step {recipe.steps.findIndex(s => s.id === activeStepId) + 1} of {recipe.steps.length}
          </Text>
          <TouchableOpacity style={styles.pauseBtn} onPress={handleStepPause} activeOpacity={0.8}>
            <Ionicons name="pause" size={16} color="#fff" />
            <Text style={styles.pauseBtnText}>Pause</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Start Button */}
      {!started && (
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Ionicons name="play-circle" size={24} color="#fff" />
          <Text style={styles.startBtnText}>Start Cooking</Text>
        </TouchableOpacity>
      )}

      {/* Steps List */}
      <View style={styles.stepsSection}>
        <Text style={styles.stepsSectionTitle}>Recipe Steps</Text>
        <StepList
          steps={recipe.steps}
          readOnly={!started}
          activeStepId={activeStepId}
          onStepStart={handleStepStart}
          onStepPause={handleStepPause}
          onStepComplete={handleStepComplete}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  content: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF7ED' },
  errorText: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  backBtn: { backgroundColor: '#F97316', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: '#fff', fontWeight: '700' },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  recipeName: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 10 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  metaText: { fontSize: 12, color: '#9A3412', fontWeight: '600' },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
  },
  doneEmoji: { fontSize: 36 },
  doneTitle: { fontSize: 18, fontWeight: '800', color: '#065F46' },
  doneSubtitle: { fontSize: 13, color: '#059669', marginTop: 2 },
  activeCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F97316',
  },
  activeLabel: { fontSize: 11, fontWeight: '700', color: '#9A3412', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  activeStepName: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  activeProgress: { fontSize: 13, color: '#6B7280' },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F97316',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginTop: 12,
  },
  pauseBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#F97316',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  stepsSection: { gap: 0 },
  stepsSectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
});
