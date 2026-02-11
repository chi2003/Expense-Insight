import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Category } from '@/lib/types';
import { Colors } from '@/constants/colors';

interface CategoryCardProps {
  category: Category;
  total: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getIcon(name: string, family: string, size: number, color: string) {
  const props = { name: name as any, size, color };
  switch (family) {
    case 'Ionicons': return <Ionicons {...props} />;
    case 'MaterialIcons': return <MaterialIcons {...props} />;
    case 'Feather': return <Feather {...props} />;
    case 'FontAwesome': return <FontAwesome {...props} />;
    case 'MaterialCommunityIcons': return <MaterialCommunityIcons {...props} />;
    default: return <MaterialIcons {...props} />;
  }
}

export function CategoryCard({ category, total, onPress, onLongPress }: CategoryCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const formattedTotal = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isIncome = category.type === 'income';

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animStyle, styles.card]}
      testID={`category-card-${category.id}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        {getIcon(category.icon, category.iconFamily, 22, category.color)}
      </View>
      <Text style={styles.name} numberOfLines={1}>{category.name}</Text>
      <Text style={[styles.amount, isIncome && styles.incomeAmount]}>
        {isIncome ? '+' : '-'}${formattedTotal}
      </Text>
    </AnimatedPressable>
  );
}

export { getIcon };

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
    marginBottom: 4,
  },
  amount: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'DMSans_700Bold',
  },
  incomeAmount: {
    color: Colors.accent,
  },
});
