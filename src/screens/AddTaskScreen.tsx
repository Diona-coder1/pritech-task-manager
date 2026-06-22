import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTasks } from '../context/TaskContext';
import { colors, radius, shadow, spacing } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

type FormErrors = {
  title?: string;
  description?: string;
};

export default function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (title.trim().length < 3) {
      nextErrors.title = 'Title should have at least 3 characters.';
    }

    if (description.trim().length < 5) {
      nextErrors.description =
        'Description should have at least 5 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    addTask({ title, description });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <Text style={styles.kicker}>New task</Text>
          <Text style={styles.heading}>Create a clear action item</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Title</Text>
            <TextInput
              autoCapitalize="sentences"
              onChangeText={setTitle}
              placeholder="Example: Prepare interview notes"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
            />
            {errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="Add a short description for this task"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              textAlignVertical="top"
              value={description}
            />
            {errors.description ? (
              <Text style={styles.error}>{errors.description}</Text>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            <Text style={styles.submitText}>Save Task</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 720,
    width: '100%',
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  form: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadow,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.danger,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  pageHeader: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  textArea: {
    minHeight: 120,
  },
});
