import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { TaskFilter } from '../types';

type SegmentedFilterProps = {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

const filters: { label: string; value: TaskFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'completed' },
];

export default function SegmentedFilter({
  value,
  onChange,
}: SegmentedFilterProps) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isSelected = filter.value === value;

        return (
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            onPress={() => onChange(filter.value)}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            <Text
              style={[styles.optionText, isSelected && styles.optionTextActive]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  option: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  optionTextActive: {
    color: colors.surface,
  },
});

