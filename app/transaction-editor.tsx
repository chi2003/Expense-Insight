import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useBudget } from '@/lib/budget-context';
import { Numpad } from '@/components/Numpad';
import { SubcategoryPicker } from '@/components/SubcategoryPicker';
import { TransactionMiniMenu } from '@/components/TransactionMiniMenu';
import { getIcon } from '@/components/CategoryCard';

export default function TransactionEditor() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const insets = useSafeAreaInsets();
  const { categories, addTransaction } = useBudget();

  const category = categories.find((c) => c.id === categoryId);

  const [amount, setAmount] = useState('0');
  const [subcategory, setSubcategory] = useState(category?.subcategories[0] || '');
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [account, setAccount] = useState('Cash');
  const [date, setDate] = useState(new Date());

  if (!category) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  const handleNumpadPress = (key: string) => {
    setAmount((prev) => {
      if (prev === '0' && key !== '.') return key;
      if (key === '.' && prev.includes('.')) return prev;
      const parts = prev.split('.');
      if (parts[1] && parts[1].length >= 2) return prev;
      if (prev.length >= 10) return prev;
      return prev + key;
    });
  };

  const handleDelete = () => {
    setAmount((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    addTransaction({
      categoryId: category.id,
      subcategory,
      amount: numAmount,
      tags,
      note,
      account,
      date: date.toISOString(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const isIncome = category.type === 'income';
  const displayAmount = amount === '0' ? '0.00' : amount;

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + webTopInset }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: category.color + '20' }]}>
            {getIcon(category.icon, category.iconFamily, 18, category.color)}
          </View>
          <Text style={styles.headerTitle}>{category.name}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>{isIncome ? '+' : '-'}$</Text>
        <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
          {displayAmount}
        </Text>
      </View>

      <View style={styles.subcategorySection}>
        <SubcategoryPicker
          subcategories={category.subcategories}
          selected={subcategory}
          onSelect={setSubcategory}
          accentColor={category.color}
        />
      </View>

      <View style={styles.miniMenuSection}>
        <TransactionMiniMenu
          tags={tags}
          onTagsChange={setTags}
          note={note}
          onNoteChange={setNote}
          account={account}
          onAccountChange={setAccount}
          date={date}
          onDateChange={setDate}
        />
      </View>

      <View style={[styles.numpadSection, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Numpad
          onPress={handleNumpadPress}
          onDelete={handleDelete}
          onConfirm={handleConfirm}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'DMSans_600SemiBold',
  },
  headerSpacer: {
    width: 40,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  currencySymbol: {
    color: Colors.textSecondary,
    fontSize: 28,
    fontFamily: 'DMSans_500Medium',
    marginRight: 4,
  },
  amountText: {
    color: Colors.text,
    fontSize: 48,
    fontFamily: 'DMSans_700Bold',
    maxWidth: '80%',
  },
  subcategorySection: {
    marginBottom: 12,
  },
  miniMenuSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  numpadSection: {
    paddingTop: 12,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});
