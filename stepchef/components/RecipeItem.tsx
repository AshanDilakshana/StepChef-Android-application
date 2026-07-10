import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Recipe } from '../utils/types';
import StepList from './StepList';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type RecipeItemProps = {
  recipe: Recipe;
  onDelete?: (id: string) => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Main Course': '#F97316',
  Appetizer: '#8B5CF6',
  Dessert: '#EC4899',
  Beverage: '#06B6D4',
  Snack: '#10B981',
  Uncategorized: '#6B7280',
};

const RecipeItem = ({ recipe, onDelete }: RecipeItemProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[recipe.category] ?? '#6B7280';

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          <View style={[styles.catDot, { backgroundColor: catColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
            <Text style={[styles.category, { color: catColor }]}>{recipe.category}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cookBtn}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={14} color="#fff" />
            <Text style={styles.cookBtnText}>Cook</Text>
          </TouchableOpacity>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#9CA3AF"
          />
        </View>
      </TouchableOpacity>

      {/* Meta row */}
      <View style={styles.meta}>
        <View style={styles.metaChip}>
          <Ionicons name="list-outline" size={12} color="#6B7280" />
          <Text style={styles.metaText}>{recipe.steps.length} steps</Text>
        </View>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(recipe.id)} style={styles.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded Steps */}
      {expanded && (
        <View style={styles.stepsContainer}>
          <View style={styles.divider} />
          <StepList steps={recipe.steps} readOnly />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  category: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  cookBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#6B7280' },
  deleteBtn: { padding: 4 },
  stepsContainer: { paddingHorizontal: 12, paddingBottom: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
});

export default RecipeItem;