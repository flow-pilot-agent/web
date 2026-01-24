<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte'
  import { taskStore } from '../stores/taskStore.svelte'
  import TaskList from '../components/task/TaskList.svelte'
  import TaskForm from '../components/task/TaskForm.svelte'
  import Button from '../components/ui/Button.svelte'
  import ThemeToggle from '../components/ui/ThemeToggle.svelte'
  import { navigate } from '../router/index.svelte'
  import type { Task, CreateTaskInput } from '../api/types'

  // Modal state
  let showTaskForm = $state(false)
  let editingTask = $state<Task | undefined>(undefined)

  /**
   * Handle task card click
   */
  function handleTaskClick(task: Task): void {
    editingTask = task
    showTaskForm = true
  }

  /**
   * Open create task form
   */
  function openCreateTaskForm(): void {
    editingTask = undefined
    showTaskForm = true
  }

  /**
   * Load tasks on mount
   */
  onMount(async () => {
    await taskStore.fetchTasks()
  })
</script>

<div class="tasks-page">
  <!-- Header -->
  <header class="tasks-header">
    <div class="header-left">
      <button
        class="back-button"
        onclick={() => navigate('/dashboard')}
        aria-label="返回"
      >
        <Icon icon="lucide:arrow-left" />
        返回
      </button>
      <h1 class="header-title">任务管理</h1>
    </div>

    <div class="header-actions">
      <ThemeToggle size="md" />
      <Button
        variant="primary"
        onclick={openCreateTaskForm}
        aria-label="创建新任务"
      >
        <Icon icon="lucide:plus" />
        新建任务
      </Button>
    </div>
  </header>

  <!-- Main Content -->
  <main class="tasks-main">
    <!-- Task List -->
    <div class="tasks-list-container">
      <TaskList
        onTaskClick={handleTaskClick}
      />
    </div>
  </main>

  <!-- Task Form Modal -->
  {#if showTaskForm}
    <TaskForm
      open={showTaskForm}
      onClose={() => showTaskForm = false}
      task={editingTask as CreateTaskInput | undefined}
    />
  {/if}
</div>

<style>
  .tasks-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .tasks-header {
      background-color: #1f2937;
      border-bottom-color: #374151;
    }
  }

  :global(.dark) .tasks-header {
    background-color: #1f2937;
    border-bottom-color: #374151;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s;
  }

  @media (prefers-color-scheme: dark) {
    .back-button {
      background-color: #374151;
      border-color: #4b5563;
      color: #d1d5db;
    }
  }

  :global(.dark) .back-button {
    background-color: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }

  .back-button:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  @media (prefers-color-scheme: dark) {
    .back-button:hover {
      background-color: #4b5563;
      border-color: #6b7280;
    }
  }

  :global(.dark) .back-button:hover {
    background-color: #4b5563;
    border-color: #6b7280;
  }

  .header-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .header-title {
      color: #f9fafb;
    }
  }

  :global(.dark) .header-title {
    color: #f9fafb;
  }

  .header-actions {
    display: flex;
    gap: 0.75rem;
  }

  .tasks-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  .tasks-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
