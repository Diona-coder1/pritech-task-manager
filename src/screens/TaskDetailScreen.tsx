import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import { useTasks } from '../context/TaskContext';
import { colors, radius, spacing } from '../theme';
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
        <EmptyState
          title="Task not found"
          message="This task may have been removed."
        />
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
              task.completed ? styles.statusDoneText : styles.statusActiveText,
            ]}
          >
            {task.completed ? 'Completed' : 'Not completed'}
          </Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.created}>Created {formatDate(task.createdAt)}</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => toggleTask(task.id)}
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.primaryButtonText}>
            {task.completed ? 'Mark as Active' : 'Mark as Completed'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </Pressable>
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
  container: {
    flex: 1,
    padding: spacing.lg,
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
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.xl,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  statusActive: {
    backgroundColor: '#DBEAFE',
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
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: spacing.lg,
  },
});

