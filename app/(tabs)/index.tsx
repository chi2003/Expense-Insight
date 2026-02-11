import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useBudget } from '@/lib/budget-context';
import { CategoryCard } from '@/components/CategoryCard';
import { TimePeriodSelector } from '@/components/TimePeriodSelector';
import { CategoryCustomizer } from '@/components/CategoryCustomizer';
import { Category } from '@/lib/types';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { categories, timePeriod, setTimePeriod, getCategoryTotal, updateCategory, isLoading, transactions } = useBudget();
  const [customizerCategory, setCustomizerCategory] = useState<Category | null>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const totalExpenses = expenseCategories.reduce((sum, c) => sum + getCategoryTotal(c.id), 0);
  const totalIncome = incomeCategories.reduce((sum, c) => sum + getCategoryTotal(c.id), 0);
  const balance = totalIncome - totalExpenses;

  const handleCardPress = useCallback((categoryId: string) => {
    router.push({ pathname: '/transaction-editor', params: { categoryId } });
  }, []);

  const handleCardLongPress = useCallback((category: Category) => {
    setCustomizerCategory(category);
  }, []);

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 84 : 0;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top + webTopInset }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + webTopInset + 16,
            paddingBottom: insets.bottom + webBottomInset + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={[styles.balanceAmount, balance < 0 && styles.negativeBalance]}>
            ${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.balanceSummary}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.accent }]} />
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.summaryValue}>
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.summaryValue}>
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.periodSection}>
          <TimePeriodSelector selected={timePeriod} onSelect={setTimePeriod} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <Text style={styles.sectionCount}>{expenseCategories.length}</Text>
        </View>
        <View style={styles.cardGrid}>
          {expenseCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              total={getCategoryTotal(cat.id)}
              onPress={() => handleCardPress(cat.id)}
              onLongPress={() => handleCardLongPress(cat)}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Income</Text>
          <Text style={styles.sectionCount}>{incomeCategories.length}</Text>
        </View>
        <View style={styles.cardGrid}>
          {incomeCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              total={getCategoryTotal(cat.id)}
              onPress={() => handleCardPress(cat.id)}
              onLongPress={() => handleCardLongPress(cat)}
            />
          ))}
        </View>

        <Text style={styles.hintText}>Long press a card to customize</Text>
      </ScrollView>

      <CategoryCustomizer
        visible={!!customizerCategory}
        category={customizerCategory}
        onClose={() => setCustomizerCategory(null)}
        onSave={updateCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'DMSans_500Medium',
    marginBottom: 4,
  },
  balanceAmount: {
    color: Colors.text,
    fontSize: 40,
    fontFamily: 'DMSans_700Bold',
    marginBottom: 16,
  },
  negativeBalance: {
    color: Colors.danger,
  },
  balanceSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
  },
  summaryValue: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  periodSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
  },
  sectionCount: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
});
