import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { fetchTaskSuggestions } from '../api/suggestionsApi';
import EmptyState from '../components/EmptyState';
import SegmentedFilter from '../components/SegmentedFilter';
import SuggestionCard from '../components/SuggestionCard';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../context/TaskContext';
import { colors, radius, shadow, spacing } from '../theme';
import { ApiSuggestion, RootStackParamList, Task, TaskFilter } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'>;

export default function TaskListScreen({ navigation }: Props) {
  const { addTask, deleteTask, isLoading, tasks, toggleTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [suggestions, setSuggestions] = useState<ApiSuggestion[]>([]);
  const [suggestionsError, setSuggestionsError] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchTaskSuggestions()
      .then((data) => {
        if (isMounted) {
          setSuggestions(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSuggestionsError('Suggestions are unavailable right now.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSuggestions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const completedCount = tasks.filter((task) => task.completed).length;

    return {
      total: tasks.length,
      active: tasks.length - completedCount,
      completed: completedCount,
    };
  }, [tasks]);

  const completionRate = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);

      return matchesSearch && matchesStatus;
    });
  }, [filter, searchTerm, tasks]);

  const handleAddSuggestion = (suggestion: ApiSuggestion) => {
    addTask({
      title: suggestion.title,
      description: suggestion.description,
    });
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onDelete={deleteTask}
      onOpen={(taskId) => navigation.navigate('TaskDetail', { taskId })}
      onToggle={toggleTask}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.kicker}>PRITECH technical task</Text>
          <Text style={styles.heading}>Personal task manager</Text>
          <Text style={styles.subheading}>
            {stats.active} active tasks, {completionRate}% completed
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('AddTask')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>New Task</Text>
        </Pressable>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Completion progress</Text>
          <Text style={styles.progressValue}>{completionRate}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${completionRate}%` }]}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearchTerm}
          placeholder="Search tasks by title"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={searchTerm}
        />

        <SegmentedFilter value={filter} onChange={setFilter} />
      </View>

      <View style={styles.suggestionsHeader}>
        <View>
          <Text style={styles.sectionTitle}>Live API suggestions</Text>
          <Text style={styles.sectionSubtitle}>Powered by DummyJSON</Text>
        </View>
        {isLoadingSuggestions ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : null}
      </View>
      {suggestionsError ? (
        <Text style={styles.apiError}>{suggestionsError}</Text>
      ) : null}
      {suggestions.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionList}
        >
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              onAdd={handleAddSuggestion}
              suggestion={suggestion}
            />
          ))}
        </ScrollView>
      ) : null}

      <View style={styles.tasksHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <Text style={styles.sectionSubtitle}>{filteredTasks.length} shown</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
          message={
            tasks.length === 0
              ? 'Create your first personal task or add one from the API suggestions.'
              : 'Try changing the search text or status filter.'
          }
        />
      }
      ListHeaderComponent={renderHeader}
      renderItem={renderTask}
    />
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  apiError: {
    color: colors.textMuted,
    fontSize: 13,
  },
  headerContent: {
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  heading: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    marginTop: spacing.xs,
  },
  hero: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  heroText: {
    flex: 1,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  listContent: {
    alignSelf: 'center',
    maxWidth: 980,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  statBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 88,
    padding: spacing.lg,
    ...shadow,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadow,
  },
  progressFill: {
    backgroundColor: colors.success,
    borderRadius: 999,
    height: '100%',
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    backgroundColor: colors.successSoft,
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressValue: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '900',
  },
  subheading: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  suggestionList: {
    marginRight: -spacing.lg,
  },
  suggestionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  tasksHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolbar: {
    gap: spacing.md,
  },
});
