import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RecipeItem from '../components/RecipeItem';
import MeasurementConverter from '../screens/MeasurementConverter';
import { getRecipes, deleteRecipe } from '../utils/api';
import { Recipe } from '../utils/types';

const CATEGORIES = ['All', 'Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Snack'];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConverter, setShowConverter] = useState(false);

  const loadRecipes = useCallback(async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load recipes. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteRecipe(id);
          setRecipes(prev => prev.filter(r => r.id !== id));
        },
      },
    ]);
  };

  const filtered = category === 'All' ? recipes : recipes.filter(r => r.category === category);

  const EmptyState = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyEmoji}>🍳</Text>
      <Text style={styles.emptyTitle}>No recipes yet!</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to add your first recipe</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/add-recipe')} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" />
        <Text style={styles.emptyBtnText}>Add Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{recipes.length}</Text>
          <Text style={styles.statLabel}>Recipes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNum}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.statLabel}>Current Time</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => setShowConverter(v => !v)}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={22} color="#F97316" />
          <Text style={styles.statLabel}>Converter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RecipeItem recipe={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadRecipes(); }} tintColor="#F97316" />
        }
        ListHeaderComponent={
          <View>
            {showConverter && <MeasurementConverter />}
            {/* Category Filter */}
            <View style={styles.pickerWrapper}>
              <Ionicons name="filter-outline" size={16} color="#F97316" style={{ marginLeft: 10 }} />
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                {CATEGORIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
              </Picker>
            </View>
          </View>
        }
        ListEmptyComponent={loading ? (
          <ActivityIndicator size="large" color="#F97316" style={{ marginTop: 60 }} />
        ) : <EmptyState />}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push('/add-recipe')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7ED' },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statNum: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: '#F3F4F6', marginHorizontal: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    overflow: 'hidden',
  },
  picker: { flex: 1, height: 48, color: '#1F2937' },
  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 13, borderRadius: 99 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
});