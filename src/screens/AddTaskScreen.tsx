import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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

const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 240;

export default function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<
    'title' | 'description' | null
  >(null);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.formCard}>
            <View style={styles.pageHeader}>
              <View style={styles.headerIcon}>
                <Ionicons
                  color={colors.primary}
                  name="clipboard-outline"
                  size={30}
                />
                <View style={styles.headerIconBadge}>
                  <Ionicons color={colors.surface} name="add" size={14} />
                </View>
              </View>

              <View style={styles.headerCopy}>
                <Text style={styles.kicker}>New task</Text>
                <Text style={styles.heading}>Create a clear action item</Text>
                <Text style={styles.subheading}>
                  Add the details of your task to stay organized and productive.
                </Text>
              </View>
            </View>

            <View style={styles.fieldsPanel}>
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <View style={styles.fieldIcon}>
                    <Ionicons
                      color={colors.primary}
                      name="pencil-outline"
                      size={16}
                    />
                  </View>
                  <Text style={styles.label}>
                    Title <Text style={styles.required}>*</Text>
                  </Text>
                </View>

                <TextInput
                  autoCapitalize="sentences"
                  maxLength={TITLE_LIMIT}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={setTitle}
                  onFocus={() => setFocusedField('title')}
                  placeholder="Example: Prepare interview notes"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    focusedField === 'title' && styles.inputFocused,
                    errors.title && styles.inputError,
                  ]}
                  value={title}
                />

                <View style={styles.helperRow}>
                  <Text style={[styles.helper, errors.title && styles.error]}>
                    {errors.title || 'Enter a short, clear title for your task.'}
                  </Text>
                  <Text style={styles.counter}>
                    {title.length} / {TITLE_LIMIT}
                  </Text>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <View style={styles.fieldIcon}>
                    <Ionicons
                      color={colors.primary}
                      name="list-outline"
                      size={17}
                    />
                  </View>
                  <Text style={styles.label}>
                    Description <Text style={styles.required}>*</Text>
                  </Text>
                </View>

                <TextInput
                  maxLength={DESCRIPTION_LIMIT}
                  multiline
                  onBlur={() => setFocusedField(null)}
                  onChangeText={setDescription}
                  onFocus={() => setFocusedField('description')}
                  placeholder="Add a short description for this task..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    styles.textArea,
                    focusedField === 'description' && styles.inputFocused,
                    errors.description && styles.inputError,
                  ]}
                  textAlignVertical="top"
                  value={description}
                />

                <View style={styles.helperRow}>
                  <Text
                    style={[styles.helper, errors.description && styles.error]}
                  >
                    {errors.description ||
                      'Provide enough context to make the task actionable.'}
                  </Text>
                  <Text style={styles.counter}>
                    {description.length} / {DESCRIPTION_LIMIT}
                  </Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Ionicons
                  color={colors.primary}
                  name="bulb-outline"
                  size={18}
                />
                <Text style={styles.infoText}>
                  A strong description helps you remember the important details.
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.goBack()}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Ionicons color={colors.textMuted} name="close" size={18} />
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleSubmit}
                style={[styles.actionButton, styles.submitButton]}
              >
                <Ionicons
                  color={colors.surface}
                  name="save-outline"
                  size={18}
                />
                <Text style={styles.submitText}>Save Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '800',
  },
  container: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 760,
    width: '100%',
  },
  counter: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  fieldsPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.xl,
    ...shadow,
  },
  headerCopy: {
    flex: 1,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 60,
    justifyContent: 'center',
    position: 'relative',
    width: 60,
  },
  headerIconBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    bottom: 10,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    width: 20,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  helper: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  helperRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  infoBox: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: '#C7D8FF',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  infoText: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
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
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  required: {
    color: colors.danger,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  textArea: {
    minHeight: 112,
  },
});
