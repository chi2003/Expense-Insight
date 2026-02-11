import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { DEFAULT_ACCOUNTS } from '@/lib/types';

interface TransactionMiniMenuProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  note: string;
  onNoteChange: (note: string) => void;
  account: string;
  onAccountChange: (account: string) => void;
  date: Date;
  onDateChange: (date: Date) => void;
}

type ActivePanel = 'none' | 'tags' | 'note' | 'account' | 'date';

export function TransactionMiniMenu({
  tags,
  onTagsChange,
  note,
  onNoteChange,
  account,
  onAccountChange,
  date,
  onDateChange,
}: TransactionMiniMenuProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [tagInput, setTagInput] = useState('');

  const togglePanel = (panel: ActivePanel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  const menuItems = [
    {
      key: 'tags' as ActivePanel,
      icon: 'pricetag-outline' as const,
      label: tags.length > 0 ? `${tags.length} tags` : 'Tags',
      active: tags.length > 0,
    },
    {
      key: 'note' as ActivePanel,
      icon: 'document-text-outline' as const,
      label: note ? 'Note added' : 'Note',
      active: !!note,
    },
    {
      key: 'account' as ActivePanel,
      icon: 'wallet-outline' as const,
      label: account || 'Account',
      active: !!account,
    },
    {
      key: 'date' as ActivePanel,
      icon: 'calendar-outline' as const,
      label: formatShortDate(date),
      active: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menuScroll}
      >
        {menuItems.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => togglePanel(item.key)}
            style={[
              styles.menuItem,
              activePanel === item.key && styles.menuItemActive,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={activePanel === item.key ? Colors.accent : item.active ? Colors.text : Colors.textMuted}
            />
            <Text
              style={[
                styles.menuLabel,
                activePanel === item.key && styles.menuLabelActive,
                item.active && styles.menuLabelHighlighted,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {activePanel === 'tags' && (
        <View style={styles.panel}>
          <View style={styles.tagInputRow}>
            <TextInput
              style={styles.tagInput}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tag..."
              placeholderTextColor={Colors.textMuted}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <Pressable onPress={addTag} style={styles.addTagBtn}>
              <Ionicons name="add" size={20} color={Colors.accent} />
            </Pressable>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Pressable key={tag} onPress={() => removeTag(tag)} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close" size={12} color={Colors.textSecondary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}

      {activePanel === 'note' && (
        <View style={styles.panel}>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={onNoteChange}
            placeholder="Add a note..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={200}
          />
        </View>
      )}

      {activePanel === 'account' && (
        <View style={styles.panel}>
          <View style={styles.accountGrid}>
            {DEFAULT_ACCOUNTS.map((acc) => (
              <Pressable
                key={acc}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onAccountChange(acc);
                  setActivePanel('none');
                }}
                style={[
                  styles.accountPill,
                  account === acc && styles.accountPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.accountText,
                    account === acc && styles.accountTextActive,
                  ]}
                >
                  {acc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {activePanel === 'date' && (
        <View style={styles.panel}>
          <View style={styles.dateRow}>
            <Pressable
              onPress={() => {
                onDateChange(new Date());
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.datePill, isToday(date) && styles.datePillActive]}
            >
              <Text style={[styles.dateText, isToday(date) && styles.dateTextActive]}>Today</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                onDateChange(yesterday);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.datePill, isYesterday(date) && styles.datePillActive]}
            >
              <Text style={[styles.dateText, isYesterday(date) && styles.dateTextActive]}>Yesterday</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const twoDaysAgo = new Date();
                twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
                onDateChange(twoDaysAgo);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.datePill, !isToday(date) && !isYesterday(date) && styles.datePillActive]}
            >
              <Text style={[styles.dateText, !isToday(date) && !isYesterday(date) && styles.dateTextActive]}>
                {formatShortDate((() => { const d = new Date(); d.setDate(d.getDate() - 2); return d; })())}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function formatShortDate(d: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function isToday(d: Date): boolean {
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isYesterday(d: Date): boolean {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return d.getDate() === y.getDate() && d.getMonth() === y.getMonth() && d.getFullYear() === y.getFullYear();
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  menuScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemActive: {
    borderColor: Colors.accent + '60',
    backgroundColor: Colors.accent + '15',
  },
  menuLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },
  menuLabelActive: {
    color: Colors.accent,
  },
  menuLabelHighlighted: {
    color: Colors.textSecondary,
  },
  panel: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addTagBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: Colors.accent + '20',
  },
  tagText: {
    color: Colors.accent,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },
  noteInput: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  accountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
  },
  accountPillActive: {
    backgroundColor: Colors.accent,
  },
  accountText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: 'DMSans_500Medium',
  },
  accountTextActive: {
    color: Colors.background,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  datePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  datePillActive: {
    backgroundColor: Colors.accent,
  },
  dateText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'DMSans_500Medium',
  },
  dateTextActive: {
    color: Colors.background,
  },
});
