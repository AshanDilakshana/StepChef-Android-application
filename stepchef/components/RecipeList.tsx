import React from 'react';
import { View, StyleSheet } from 'react-native';
import RecipeItem from './RecipeItem';
import { Recipe } from '../utils/types';

type RecipeListProps = {
  recipes: Recipe[];
  onDelete?: (id: string) => void;
};

const RecipeList = ({ recipes, onDelete }: RecipeListProps) => {
  return (
    <View style={styles.container}>
      {recipes.map(recipe => (
        <RecipeItem key={recipe.id} recipe={recipe} onDelete={onDelete} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 4 },
});

export default RecipeList;