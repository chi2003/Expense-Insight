import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Modal, Platform } from 'react-native';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Category } from '@/lib/types';

interface CategoryCustomizerProps {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Category>) => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#FF8A65', '#FFB74D', '#FFD54F', '#AED581',
  '#4ECDC4', '#4DD0E1', '#4FC3F7', '#7986CB', '#A78BFA',
  '#CE93D8', '#F06292', '#EC4899', '#EF5350', '#26A69A',
  '#66BB6A', '#42A5F5', '#5C6BC0', '#AB47BC', '#8D6E63',
];

const ICON_OPTIONS: { icon: string; family: string }[] = [
  { icon: 'restaurant', family: 'MaterialIcons' },
  { icon: 'directions-car', family: 'MaterialIcons' },
  { icon: 'shopping-bag', family: 'Feather' },
  { icon: 'movie', family: 'MaterialIcons' },
  { icon: 'heart', family: 'Ionicons' },
  { icon: 'receipt', family: 'MaterialIcons' },
  { icon: 'school', family: 'MaterialIcons' },
  { icon: 'account-balance-wallet', family: 'MaterialIcons' },
  { icon: 'laptop', family: 'MaterialIcons' },
  { icon: 'trending-up', family: 'Feather' },
  { icon: 'home', family: 'MaterialIcons' },
  { icon: 'flight', family: 'MaterialIcons' },
  { icon: 'fitness-center', family: 'MaterialIcons' },
  { icon: 'pets', family: 'MaterialIcons' },
  { icon: 'music-note', family: 'MaterialIcons' },
  { icon: 'coffee', family: 'MaterialCommunityIcons' },
  { icon: 'gift', family: 'Feather' },
  { icon: 'book', family: 'Feather' },
  { icon: 'camera', family: 'Feather' },
  { icon: 'star', family: 'Feather' },
];

function renderIcon(name: string, family: string, size: number, color: string) {
  const props = { name: name as any, size, color };
  switch (family) {
    case 'Ionicons': return <Ionicons {...props} />;
    case 'MaterialIcons': return <MaterialIcons {...props} />;
    case 'Feather': return <Feather {...props} />;
    case 'MaterialCommunityIcons': return <MaterialCommunityIcons {...props} />;
    default: return <MaterialIcons {...props} />;
  }
}

export function CategoryCustomizer({ visible, category, onClose, onSave }: CategoryCustomizerProps) {
  const insets = useSafeAreaInsets();
  const [selectedColor, setSelectedColor] = useState(category?.color || PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || 'restaurant');
  const [selectedFamily, setSelectedFamily] = useState(category?.iconFamily || 'MaterialIcons');

  React.useEffect(() => {
    if (category) {
      setSelectedColor(category.color);
      setSelectedIcon(category.icon);
      setSelectedFamily(category.iconFamily);
    }
  }, [category]);

  if (!category) return null;

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(category.id, {
      color: selectedColor,
      icon: selectedIcon,
      iconFamily: selectedFamily as Category['iconFamily'],
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Customize {category.name}</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.preview}>
            <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
              {renderIcon(selectedIcon, selectedFamily, 28, selectedColor)}
            </View>
          </View>

          <Text style={styles.sectionLabel}>Icon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconGrid}>
            {ICON_OPTIONS.map((opt) => {
              const isActive = opt.icon === selectedIcon;
              return (
                <Pressable
                  key={opt.icon}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedIcon(opt.icon);
                    setSelectedFamily(opt.family);
                  }}
                  style={[styles.iconOption, isActive && { borderColor: selectedColor }]}
                >
                  {renderIcon(opt.icon, opt.family, 20, isActive ? selectedColor : Colors.textSecondary)}
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map((color) => {
              const isActive = color === selectedColor;
              return (
                <Pressable
                  key={color}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedColor(color);
                  }}
                  style={[styles.colorOption, { backgroundColor: color }, isActive && styles.colorActive]}
                >
                  {isActive && <Ionicons name="checkmark" size={16} color="#fff" />}
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={handleSave} style={[styles.saveButton, { backgroundColor: selectedColor }]}>
            <Ionicons name="checkmark" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
  },
  preview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'DMSans_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  iconGrid: {
    gap: 8,
    paddingBottom: 20,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorActive: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
