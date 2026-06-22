import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../theme';
import { ApiSuggestion } from '../types';

type SuggestionCardProps = {
  suggestion: ApiSuggestion;
  onAdd: (suggestion: ApiSuggestion) => void;
};

export default function SuggestionCard({
  suggestion,
  onAdd,
}: SuggestionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onAdd(suggestion)}
      style={styles.card}
    >
      <View style={styles.pill}>
        <Text style={styles.pillText}>API</Text>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {suggestion.title}
      </Text>
      <Text style={styles.action}>Use this task</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.md,
    minHeight: 132,
    padding: spacing.md,
    width: 230,
    ...shadow,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pillText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
});
