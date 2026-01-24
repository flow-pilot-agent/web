<script lang="ts">
  import { taskStore } from '../../stores/taskStore.svelte'
  import TaskCard from './TaskCard.svelte'
  import TaskFilters from './TaskFilters.svelte'
  import Button from '../ui/Button.svelte'
  import Icon from '@iconify/svelte'
  import type { Task } from '../../api/types'

  interface Props {
    onTaskClick?: (task: Task) => void
  }

  let { onTaskClick }: Props = $props()

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
  <TaskFilters filter={taskStore.filter} setFilter={f => taskStore.setFilter(f)} />

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
        {taskStore.filter.searchQuery ||
        taskStore.filter.status !== 'all' ||
        taskStore.filter.priority !== 'all'
          ? '没有找到匹配的任务'
          : '点击下方按钮创建新任务'}
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

  .task-list-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .task-list-title {
      color: #f9fafb;
    }
  }

  :global(.dark) .task-list-title {
    color: #f9fafb;
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

  @media (prefers-color-scheme: dark) {
    .task-stat {
      background-color: #374151;
    }
  }

  :global(.dark) .task-stat {
    background-color: #374151;
  }

  .task-stat.overdue {
    background-color: #fef2f2;
  }

  @media (prefers-color-scheme: dark) {
    .task-stat.overdue {
      background-color: #7f1d1d;
    }
  }

  :global(.dark) .task-stat.overdue {
    background-color: #7f1d1d;
  }

  .task-stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .task-stat-value {
      color: #f9fafb;
    }
  }

  :global(.dark) .task-stat-value {
    color: #f9fafb;
  }

  .task-stat-label {
    font-size: 0.75rem;
    color: #6b7280;
  }

  @media (prefers-color-scheme: dark) {
    .task-stat-label {
      color: #9ca3af;
    }
  }

  :global(.dark) .task-stat-label {
    color: #9ca3af;
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

  @media (prefers-color-scheme: dark) {
    .task-list-loading,
    .task-list-error,
    .task-list-empty {
      background-color: #1f2937;
      border-color: #374151;
    }
  }

  :global(.dark) .task-list-loading,
  :global(.dark) .task-list-error,
  :global(.dark) .task-list-empty {
    background-color: #1f2937;
    border-color: #374151;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @media (prefers-color-scheme: dark) {
    .loading-spinner {
      border-color: #374151;
      border-top-color: #60a5fa;
    }
  }

  :global(.dark) .loading-spinner {
    border-color: #374151;
    border-top-color: #60a5fa;
  }

  .loading-text {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 0.9rem;
  }

  @media (prefers-color-scheme: dark) {
    .loading-text {
      color: #9ca3af;
    }
  }

  :global(.dark) .loading-text {
    color: #9ca3af;
  }

  .error-icon {
    width: 3rem;
    height: 3rem;
    color: #dc2626;
  }

  @media (prefers-color-scheme: dark) {
    .error-icon {
      color: #f87171;
    }
  }

  :global(.dark) .error-icon {
    color: #f87171;
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

  @media (prefers-color-scheme: dark) {
    .error-title {
      color: #f9fafb;
    }
  }

  :global(.dark) .error-title {
    color: #f9fafb;
  }

  .error-message {
    color: #6b7280;
    margin-bottom: 1rem;
  }

  @media (prefers-color-scheme: dark) {
    .error-message {
      color: #9ca3af;
    }
  }

  :global(.dark) .error-message {
    color: #9ca3af;
  }

  .empty-icon {
    width: 4rem;
    height: 4rem;
    color: #9ca3af;
  }

  @media (prefers-color-scheme: dark) {
    .empty-icon {
      color: #6b7280;
    }
  }

  :global(.dark) .empty-icon {
    color: #6b7280;
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0.5rem 0 0.25rem;
  }

  @media (prefers-color-scheme: dark) {
    .empty-title {
      color: #f9fafb;
    }
  }

  :global(.dark) .empty-title {
    color: #f9fafb;
  }

  .empty-message {
    color: #6b7280;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    .empty-message {
      color: #9ca3af;
    }
  }

  :global(.dark) .empty-message {
    color: #9ca3af;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
