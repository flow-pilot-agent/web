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
    <h1 class="task-list-title text-gray-900 dark:text-gray-100">我的任务</h1>
    <div class="task-list-stats">
      <div class="task-stat bg-gray-50 dark:bg-gray-700">
        <span class="task-stat-value text-gray-900 dark:text-gray-100">{taskStore.completedTasksCount}</span>
        <span class="task-stat-label text-gray-600 dark:text-gray-400">已完成</span>
      </div>
      <div class="task-stat bg-gray-50 dark:bg-gray-700">
        <span class="task-stat-value text-gray-900 dark:text-gray-100">{taskStore.pendingTasksCount}</span>
        <span class="task-stat-label text-gray-600 dark:text-gray-400">待处理</span>
      </div>
      {#if taskStore.overdueTasksCount > 0}
        <div class="task-stat task-stat-overdue bg-red-50 dark:bg-red-950">
          <span class="task-stat-value text-gray-900 dark:text-gray-100">{taskStore.overdueTasksCount}</span>
          <span class="task-stat-label text-gray-600 dark:text-gray-400">已逾期</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Filters -->
  <TaskFilters filter={taskStore.filter} setFilter={f => taskStore.setFilter(f)} />

  <!-- Loading state -->
  {#if taskStore.loading}
    <div class="task-list-loading bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div class="loading-spinner border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
      <p class="loading-text text-gray-600 dark:text-gray-400">加载任务中...</p>
    </div>
  {:else if taskStore.error}
    <div class="task-list-error bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <Icon icon="lucide:alert-circle" class="w-12 h-12 text-red-600 dark:text-red-400" />
      <div class="error-content">
        <h3 class="error-title text-gray-900 dark:text-gray-100">加载失败</h3>
        <p class="error-message text-gray-600 dark:text-gray-400">{taskStore.error}</p>
        <Button onclick={() => loadTasks()}>重试</Button>
      </div>
    </div>
  {:else if taskStore.filteredTasks.length === 0}
    <div class="task-list-empty bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <Icon icon="lucide:inbox" class="w-16 h-16 text-gray-400 dark:text-gray-600" />
      <h3 class="empty-title text-gray-900 dark:text-gray-100">暂无任务</h3>
      <p class="empty-message text-gray-600 dark:text-gray-400">
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
  }

  .task-stat-value {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .task-stat-label {
    font-size: 0.75rem;
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
    border-radius: 0.75rem;
    border: 1px solid;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loading-text {
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  .error-content {
    text-align: center;
  }

  .error-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .error-message {
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem;
  }

  .empty-message {
    text-align: center;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
