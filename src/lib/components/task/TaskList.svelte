<script lang="ts">
  import { taskStore, type TaskFilters } from '../../stores/taskStore'
  import TaskCard from './TaskCard.svelte'
  import TaskFilters from './TaskFilters.svelte'
  import Button from '../ui/Button.svelte'
  import Icon from '@iconify/svelte'
  import type { Task } from '../../api/types'

  interface Props {
    onTaskClick?: (task: Task) => void
  }

  let {
    onTaskClick,
  }: Props = $props()

  /**
   * Load tasks on mount
   */
  async function loadTasks(): Promise<void> {
    await taskStore.fetchTasks()
  }

  /**
   * Handle task select
   */
  function handleTaskClick(task: Task): void {
    onTaskClick?.(task)
  }

  /**
   * Get priority badge color
   */
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }
</script>

<div class="task-list">
  <!-- Header -->
  <div class="task-list-header">
    <h1 class="task-list-title">我的任务</h1>
    <div class="task-list-stats">
      <div class="task-stat">
        <span class="task-stat-value">{taskStore.completedTasksCount}</span>
        <span class="task-stat-label">已完成</span>
      </div>
      <div class="task-stat">
        <span class="task-stat-value">{taskStore.pendingTasksCount}</span>
        <span class="task-stat-label">待处理</span>
      </div>
      {#if taskStore.overdueTasksCount > 0}
        <div class="task-stat overdue">
          <span class="task-stat-value">{taskStore.overdueTasksCount}</span>
          <span class="task-stat-label">已逾期</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Filters -->
  <TaskFilters {filter={taskStore.filter} setFilter={(f) => taskStore.setFilter(f)} />

  <!-- Loading state -->
  {#if taskStore.loading}
    <div class="task-list-loading">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载任务中...</p>
    </div>
  {:else if taskStore.error}
    <div class="task-list-error">
      <Icon icon="lucide:alert-circle" class="error-icon" />
      <div class="error-content">
        <h3 class="error-title">加载失败</h3>
        <p class="error-message">{taskStore.error}</p>
        <Button onclick={() => loadTasks()}>重试</Button>
      </div>
    </div>
  {:else if taskStore.filteredTasks.length === 0}
    <div class="task-list-empty">
      <Icon icon="lucide:inbox" class="empty-icon" />
      <h3 class="empty-title">暂无任务</h3>
      <p class="empty-message">
        {taskStore.filter.searchQuery || taskStore.filter.status !== 'all' || taskStore.filter.priority !== 'all'
          ? '没有找到匹配的任务'
          : '点击下方按钮创建新任务'
        }
      </p>
    </div>
  {:else}
    <div class="task-list-content">
      {#each taskStore.filteredTasks as task (task.id)}
        <TaskCard
          {task}
          onclick={handleTaskClick}
          ondelete={() => taskStore.deleteTask(task.id)}
          onstart={() => taskStore.startTask(task.id)}
          onpause={() => taskStore.pauseTask()}
          oncomplete={() => taskStore.completeTask(task.id)}
        />
      {/each}
    </div>
  {/if}
</div>

<!-- Task Details Modal -->
{#if selectedTask}
  <div class="task-details-modal-backdrop">
    <div class="task-details-modal">
      <button
        class="task-details-close"
        onclick={() => selectedTask = null}
        aria-label="关闭任务详情"
      >
        <Icon icon="lucide:x" class="close-icon" />
      </button>

      {#snippet children(selectedTask)}
        <div class="task-details-content">
          <h2 class="task-details-title">{selectedTask.title}</h2>
          {#if selectedTask.description}
            <p class="task-details-description">{selectedTask.description}</p>
          {/if}

          <div class="task-details-meta">
            <div class="meta-item">
              <Icon icon="lucide:tag" class="meta-icon" />
              {#if selectedTask.tags && selectedTask.tags.length > 0}
                <span class="meta-tags">
                  {#each selectedTask.tags as tag}
                    <span class="meta-tag">{tag}</span>
                  {/each}
                </span>
              {:else}
                <span class="meta-empty">无标签</span>
              {/if}

            <div class="meta-item">
              <Icon icon="lucide:clock" class="meta-icon" />
              <span>预计 {selectedTask.estimateMinutes || '-'} 分钟</span>
            </div>

            {#if selectedTask.actualMinutes}
              <div class="meta-item">
                <Icon icon="lucide:check-circle-2" class="meta-icon" />
                <span>实际 {selectedTask.actualMinutes} 分钟</span>
              </div>

            {#if selectedTask.dueDate}
              <div class="meta-item">
                <Icon icon="lucide:calendar" class="meta-icon" />
                <span>{selectedTask.dueDate}</span>
              </div>

            {#if selectedTask.postponeCount > 0}
              <div class="meta-item meta-item--warning">
                <Icon icon="lucide:rotate-ccw" class="meta-icon" />
                <span>已推迟 {selectedTask.postponeCount} 次</span>
              </div>
            {/if}
          </div>

          <div class="task-details-actions">
            <Button
              variant="secondary"
              size="sm"
              onclick={() => editingTask = selectedTask; showTaskForm = true}
            >
              <Icon icon="lucide:edit" />
              编辑
            </Button>
            <Button
              variant="danger"
              size="sm"
              onclick={() => handleTaskDelete(selectedTask)}
              aria-label="删除任务"
            >
              <Icon icon="lucide:trash-2" />
            </Button>
            {#if selectedTask.status === 'pending'}
              <Button
                variant="primary"
                size="sm"
                onclick={() => handleTaskStart(selectedTask)}
                aria-label="开始任务"
              >
                <Icon icon="lucide:play" />
              </Button>
            {:else if selectedTask.status === 'in_progress'}
              <Button
                variant="warning"
                size="sm"
                onclick={handleTaskPause}
                aria-label="暂停任务"
              >
                <Icon icon="lucide:pause" />
              </Button>
            {/if}
          </div>
        </div>
      {/snippet}
    </div>
  {/if}
</div>

<!-- Task Form Modal -->
{#if showTaskForm}
  <TaskForm
    open={showTaskForm}
    onClose={() => showTaskForm = false}
    task={editingTask as CreateTaskInput | undefined}
  />
{/if}

<!-- Task Timer Modal -->
{#if showTaskTimer && taskStore.currentTask}
  <div class="timer-modal-backdrop">
    <div class="timer-modal">
      <TaskTimer
        task={taskStore.currentTask}
        onPause={handleTaskPause}
        oncomplete={() => taskStore.completeTask(taskStore.currentTask.id)}
      />
      <button
        class="timer-close"
        onclick={() => showTaskTimer = false}
        aria-label="关闭计时器"
      >
        <Icon icon="lucide:x" class="close-icon" />
      </button>
    </div>
  {/if}
</div>
</div>

<style>
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-height: 100vh;
    padding: 1.5rem;
  }

  .task-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  </div>

  .task-list-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .task-list-stats {
    display: flex;
    gap: 1rem;
  }

  .task-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: #f9fafb;
  }

  .task-stat.overdue {
    background-color: #fef2f2;
  }

  .task-stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .task-stat-label {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .task-list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .task-list-loading,
  .task-list-error,
  .task-list-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .error-icon {
    width: 3rem;
    height: 3rem;
    color: #dc2626;
  }

  .error-content {
    text-align: center;
  }

  .error-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  .empty-icon {
    width: 4rem;
    height: 4rem;
    color: #9ca3af;
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0.5rem 0 0.25rem;
  }

  .empty-message {
    color: #6b7280;
    text-align: center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Task Details Modal */
  .task-details-modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .task-details-modal {
    position: relative;
    background-color: white;
    border-radius: 1rem;
    max-width: 600px;
    width: 90%;
  }

  .task-details-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .task-details-close:hover {
    background-color: #1d4ed8;
  }

  .task-details-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .task-details-content {
    padding: 1.5rem;
  }

  .task-details-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .task-details-description {
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .task-details-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .meta-item--warning {
    color: #d97706;
  }

  .meta-icon {
    width: 1rem;
    height: 1rem;
  }

  .meta-tags {
    display: flex;
    gap: 0.375rem;
  }

  .meta-tag {
    padding: 0.25rem 0.625rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 0.75rem;
  }

  .meta-empty {
    color: #9ca3af;
  }

  .task-details-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  /* Task Timer Modal */
  .timer-modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .timer-modal {
    position: relative;
    background-color: white;
    border-radius: 1rem;
    max-width: 600px;
    width: 90%;
  }

  .timer-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #f3f4f6;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .timer-close:hover {
    background-color: #1d4ed8;
  }

  .timer-close:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>
