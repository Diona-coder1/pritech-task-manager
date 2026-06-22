import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';
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
      <Text numberOfLines={2} style={styles.title}>
        {suggestion.title}
      </Text>
      <Text style={styles.action}>Add suggestion</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceMuted,
    borderColor: '#BFDBFE',
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.md,
    minHeight: 116,
    padding: spacing.md,
    width: 220,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
});

