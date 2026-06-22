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
import { colors, radius, spacing } from '../theme';
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
      <View style={styles.summary}>
        <View>
          <Text style={styles.kicker}>Today</Text>
          <Text style={styles.heading}>Personal task board</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('AddTask')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
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

      <TextInput
        autoCapitalize="none"
        onChangeText={setSearchTerm}
        placeholder="Search tasks by title"
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        value={searchTerm}
      />

      <SegmentedFilter value={filter} onChange={setFilter} />

      <View style={styles.suggestionsHeader}>
        <Text style={styles.sectionTitle}>API suggestions</Text>
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

      <Text style={styles.sectionTitle}>Tasks</Text>
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
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
    marginTop: spacing.xs,
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
  statBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
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
    fontSize: 22,
    fontWeight: '900',
  },
  suggestionList: {
    marginRight: -spacing.lg,
  },
  suggestionsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

