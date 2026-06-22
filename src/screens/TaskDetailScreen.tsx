import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import { useTasks } from '../context/TaskContext';
import { colors, radius, shadow, spacing } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export default function TaskDetailScreen({ navigation, route }: Props) {
  const { deleteTask, getTaskById, toggleTask } = useTasks();
  const task = getTaskById(route.params.taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <EmptyState
            title="Task not found"
            message="This task may have been removed."
          />
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete task', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.panel}>
          <View
            style={[
              styles.statusBadge,
              task.completed ? styles.statusDone : styles.statusActive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                task.completed
                  ? styles.statusDoneText
                  : styles.statusActiveText,
              ]}
            >
              {task.completed ? 'Completed' : 'Active'}
            </Text>
          </View>

          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.created}>Created {formatDate(task.createdAt)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => toggleTask(task.id)}
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
              {task.completed ? 'Set Active' : 'Complete Task'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleDelete}
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Task
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 760,
    width: '100%',
  },
  created: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.sm,
  },
  deleteButton: {
    backgroundColor: colors.dangerSoft,
  },
  deleteButtonText: {
    color: colors.danger,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.xl,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadow,
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
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusActive: {
    backgroundColor: colors.primarySoft,
  },
  statusActiveText: {
    color: colors.primaryDark,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusDone: {
    backgroundColor: colors.successSoft,
  },
  statusDoneText: {
    color: '#047857',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginTop: spacing.lg,
  },
});
