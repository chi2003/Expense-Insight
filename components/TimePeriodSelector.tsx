import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { TimePeriod } from '@/lib/types';
import { Colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}

const periods: { key: TimePeriod; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function TimePeriodSelector({ selected, onSelect }: TimePeriodSelectorProps) {
  return (
    <View style={styles.container}>
      {periods.map((p) => {
        const isActive = selected === p.key;
        return (
          <Pressable
            key={p.key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(p.key);
            }}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{p.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.accent,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_600SemiBold',
  },
  labelActive: {
    color: Colors.background,
  },
});
