<script lang="ts">
  import Input from '../ui/Input.svelte'
  import Button from '../ui/Button.svelte'
  import Modal from '../ui/Modal.svelte'
  import Icon from '@iconify/svelte'
  import { taskSchema } from '../../utils/validation'
  import type { CreateTaskInput, UpdateTaskInput } from '../../api/types'
  import { taskStore, type TaskPriority } from '../../stores/taskStore.svelte'

  interface Props {
    open?: boolean
    onClose?: () => void
    task?: CreateTaskInput | UpdateTaskInput
  }

  let {
    open = false,
    onClose,
    task,
  }: Props = $props()

  // Form state
  let title = $state('')
  let description = $state('')
  let priority = $state<TaskPriority>('medium')
  let estimateMinutes = $state<number | undefined>(undefined)
  let dueDate = $state('')
  let tags = $state<string>('')

  // Tag input
  let tagInput = $state('')

  const isEdit = $derived(task !== undefined)
  const buttonText = $derived(isEdit ? '保存' : '创建')

  /**
   * Validate form
   */
  function validateForm(): boolean {
    const result = taskSchema.safeParse({
      title,
      description: description || undefined,
      priority,
      estimateMinutes,
      dueDate: dueDate || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    })

    return result.success
  }

  /**
   * Handle form submission
   */
  function handleSubmit(): void {
    if (!validateForm()) {
      return
    }

    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined

    if (isEdit) {
      // Update existing task
      const updateTaskId = (task as UpdateTaskInput & { id: string }).id
      taskStore.updateTask(updateTaskId, {
        title,
        description,
        priority,
        estimateMinutes,
        dueDate: dueDate || undefined,
        tags: tagsArray,
      })
    } else {
      // Create new task
      taskStore.createTask({
        title,
        description,
        priority,
        estimateMinutes,
        dueDate: dueDate || undefined,
        tags: tagsArray,
      })
    }

    handleClose()
  }

  /**
   * Handle modal close
   */
  function handleClose(): void {
    onClose?.()
    resetForm()
  }

  /**
   * Reset form
   */
  function resetForm(): void {
    title = ''
    description = ''
    priority = 'medium'
    estimateMinutes = undefined
    dueDate = ''
    tags = ''
    tagInput = ''
  }

  /**
   * Initialize form with task data
   */
  $effect(() => {
    if (task) {
      const taskData = task as UpdateTaskInput & { id: string }
      title = taskData.title || ''
      description = taskData.description || ''
      priority = taskData.priority || 'medium'
      estimateMinutes = taskData.estimateMinutes
      dueDate = taskData.dueDate || ''
      tags = taskData.tags?.join(', ') || ''
    } else if (!open) {
      resetForm()
    }
  })

  /**
   * Add tag
   */
  function addTag(): void {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean)
    if (!currentTags.includes(trimmed)) {
      tags = [...currentTags, trimmed].join(', ')
    }
    tagInput = ''
  }

  /**
   * Remove tag
   */
  function removeTag(tagToRemove: string): void {
    const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean)
    tags = currentTags.filter(t => t !== tagToRemove).join(', ')
  }

  /**
   * Get displayed tags
   */
  const displayedTags = $derived(
    tags.split(',').map(t => t.trim()).filter(Boolean)
  )
</script>

<Modal
  open={open}
  onClose={handleClose}
  title={isEdit ? '编辑任务' : '创建任务'}
  size="lg"
>
  <form class="task-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <!-- Title -->
    <div class="form-group">
      <Input
        id="task-title"
        label="任务标题 *"
        placeholder="请输入任务标题"
        bind:value={title}
        required
      />
    </div>

    <!-- Description -->
    <div class="form-group">
      <label for="task-description" class="form-label">任务描述</label>
      <textarea
        id="task-description"
        class="form-textarea"
        placeholder="请输入任务描述（可选）"
        bind:value={description}
        rows={3}
      />
    </div>

    <!-- Priority -->
    <div class="form-group">
      <label class="form-label">优先级</label>
      <div class="priority-options">
        <label class="priority-option">
          <input
            type="radio"
            name="priority"
            value="high"
            bind:group={priority}
          />
          <span class="priority-label priority-label--high">高</span>
        </label>
        <label class="priority-option">
          <input
            type="radio"
            name="priority"
            value="medium"
            bind:group={priority}
          />
          <span class="priority-label priority-label--medium">中</span>
        </label>
        <label class="priority-option">
          <input
            type="radio"
            name="priority"
            value="low"
            bind:group={priority}
          />
          <span class="priority-label priority-label--low">低</span>
        </label>
      </div>
    </div>

    <!-- Estimate -->
    <div class="form-group">
      <Input
        id="task-estimate"
        label="预计时长（分钟）"
        type="number"
        placeholder="请输入预计时长"
        bind:value={estimateMinutes}
        min="1"
        max="480"
      />
    </div>

    <!-- Due Date -->
    <div class="form-group">
      <Input
        id="task-dueDate"
        label="截止日期"
        type="date"
        placeholder="请选择截止日期"
        bind:value={dueDate}
      />
    </div>

    <!-- Tags -->
    <div class="form-group">
      <label class="form-label">标签</label>
      <div class="tags-container">
        {#each displayedTags as tag (tag)}
          <button
            type="button"
            class="tag-chip"
            onclick={() => removeTag(tag)}
            aria-label={`删除标签 ${tag}`}
          >
            {tag}
            <Icon icon="lucide:x" class="tag-remove-icon" />
          </button>
        {/each}

        <Input
          id="tag-input"
          type="text"
          placeholder="输入标签后按回车添加"
          bind:value={tagInput}
          onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          class="tag-input"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <Button
        type="button"
        variant="secondary"
        onclick={handleClose}
      >
        取消
      </Button>
      <Button
        type="submit"
        variant="primary"
      >
        {buttonText}
      </Button>
    </div>
  </form>
</Modal>

<style>
  .task-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    transition: all 0.15s;
  }

  .form-textarea:hover {
    border-color: #9ca3af;
  }

  .form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .form-textarea::placeholder {
    color: #9ca3af;
  }

  .priority-options {
    display: flex;
    gap: 1rem;
  }

  .priority-option {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
  }

  .priority-option input[type="radio"] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: #3b82f6;
  }

  .priority-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .priority-label--high {
    background-color: #fef2f2;
    color: #dc2626;
  }

  .priority-label--medium {
    background-color: #fef9c3;
    color: #d97706;
  }

  .priority-label--low {
    background-color: #d1fae5;
    color: #059669;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tag-chip:hover {
    background-color: #0284c7;
    color: white;
  }

  .tag-remove-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .tag-input {
    flex: 1;
    min-width: 200px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
</style>
