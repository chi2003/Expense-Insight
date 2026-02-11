import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

interface SubcategoryPickerProps {
  subcategories: string[];
  selected: string;
  onSelect: (sub: string) => void;
  accentColor: string;
}

export function SubcategoryPicker({ subcategories, selected, onSelect, accentColor }: SubcategoryPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {subcategories.map((sub) => {
        const isActive = selected === sub;
        return (
          <Pressable
            key={sub}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(sub);
            }}
            style={[
              styles.pill,
              isActive && { backgroundColor: accentColor },
            ]}
          >
            <Text
              style={[
                styles.text,
                isActive && styles.textActive,
              ]}
            >
              {sub}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
  },
  textActive: {
    color: Colors.white,
    fontFamily: 'DMSans_600SemiBold',
  },
});
