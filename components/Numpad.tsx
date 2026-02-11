import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

interface NumpadProps {
  onPress: (key: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
}

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'del'],
];

export function Numpad({ onPress, onDelete, onConfirm }: NumpadProps) {
  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === 'del') {
      onDelete();
    } else {
      onPress(key);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((key) => (
              <Pressable
                key={key}
                onPress={() => handlePress(key)}
                style={({ pressed }) => [
                  styles.key,
                  pressed && styles.keyPressed,
                ]}
              >
                {key === 'del' ? (
                  <Ionicons name="backspace-outline" size={24} color={Colors.text} />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onConfirm();
        }}
        style={({ pressed }) => [
          styles.confirmButton,
          pressed && styles.confirmPressed,
        ]}
      >
        <Ionicons name="checkmark" size={28} color={Colors.background} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  grid: {
    flex: 1,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.numpadKey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: Colors.numpadKeyPressed,
  },
  keyText: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: 'DMSans_600SemiBold',
  },
  confirmButton: {
    width: 56,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPressed: {
    opacity: 0.8,
  },
});
