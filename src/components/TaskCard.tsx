import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../theme';
import { Task } from '../types';

type TaskCardProps = {
  task: Task;
  onOpen: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export default function TaskCard({
  task,
  onOpen,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onOpen(task.id)}
      style={styles.card}
    >
      <View
        style={[
          styles.statusStrip,
          task.completed ? styles.statusStripDone : styles.statusStripActive,
        ]}
      />
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text
            numberOfLines={2}
            style={[styles.title, task.completed && styles.titleCompleted]}
          >
            {task.title}
          </Text>
          <Text style={styles.date}>Created {formatDate(task.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.badge,
            task.completed ? styles.badgeDone : styles.badgeActive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              task.completed ? styles.badgeDoneText : styles.badgeActiveText,
            ]}
          >
            {task.completed ? 'Done' : 'Active'}
          </Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {task.description}
      </Text>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onToggle(task.id)}
          style={[
            styles.button,
            task.completed ? styles.secondaryButton : styles.primaryButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              task.completed
                ? styles.secondaryButtonText
                : styles.primaryButtonText,
            ]}
          >
            {task.completed ? 'Set Active' : 'Complete'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDelete(task.id)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeActive: {
    backgroundColor: colors.primarySoft,
  },
  badgeActiveText: {
    color: colors.primaryDark,
  },
  badgeDone: {
    backgroundColor: colors.successSoft,
  },
  badgeDoneText: {
    color: '#047857',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
    paddingLeft: spacing.xl,
    ...shadow,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.dangerSoft,
  },
  deleteButtonText: {
    color: colors.danger,
    fontWeight: '800',
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.primarySoft,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
  },
  statusStrip: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5,
  },
  statusStripActive: {
    backgroundColor: colors.primary,
  },
  statusStripDone: {
    backgroundColor: colors.success,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  titleCompleted: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  titleWrap: {
    flex: 1,
  },
});
