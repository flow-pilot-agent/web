<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte'
  import { taskStore } from '../stores/taskStore'
  import TaskList from '../components/task/TaskList.svelte'
  import TaskForm from '../components/task/TaskForm.svelte'
  import TaskTimer from '../components/task/TaskTimer.svelte'
  import { navigate } from '../router'
  import type { Task, CreateTaskInput } from '../api/types'

  // Modal state
  let showTaskForm = $state(false)
  let showTaskTimer = $state(false)
  let editingTask = $state<Task | undefined>(undefined)

  // Selected task details
  let selectedTask = $state<Task | null>(null)

  /**
   * Handle task card click
   */
  function handleTaskClick(task: Task): void {
    selectedTask = task
  }

  /**
   * Close task details
   */
  function closeTaskDetails(): void {
    selectedTask = null
  }

  /**
   * Open create task form
   */
  function openCreateTaskForm(): void {
    editingTask = undefined
    showTaskForm = true
  }

  /**
   * Open edit task form
   */
  function openEditTaskForm(task: Task): void {
    editingTask = task
    selectedTask = null
    showTaskForm = true
  }

  /**
   * Handle task delete
   */
  async function handleTaskDelete(task: Task): Promise<void> {
    await taskStore.deleteTask(task.id)
    if (selectedTask?.id === task.id) {
      selectedTask = null
    }
  }

  /**
   * Handle task start
   */
  async function handleTaskStart(task: Task): Promise<void> {
    await taskStore.startTask(task.id)
    if (taskStore.currentTask) {
      showTaskTimer = true
      selectedTask = null
    }
  }

  /**
   * Handle task pause
   */
  async function handleTaskPause(): Promise<void> {
    await taskStore.pauseTask()
    if (taskStore.timerState === 'paused') {
      showTaskTimer = false
    }
  }

  /**
   * Handle task complete
   */
  async function handleTaskComplete(): Promise<void> {
    if (taskStore.currentTask) {
      await taskStore.completeTask(taskStore.currentTask.id)
      showTaskTimer = false
    }
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
        ontaskclick={handleTaskClick}
      >
        {#snippet children(task)}
          <div class="task-details">
            <div class="task-details-content">
              <h2 class="task-details-title">{task.title}</h2>
              {#if task.description}
                <p class="task-details-description">{task.description}</p>
              {/if}

              <div class="task-details-meta">
                <div class="meta-item">
                  <Icon icon="lucide:tag" class="meta-icon" />
                  {#if task.tags && task.tags.length > 0}
                    <span class="meta-tags">
                      {#each task.tags as tag}
                        <span class="meta-tag">{tag}</span>
                      {/each}
                    </span>
                  {:else}
                    <span class="meta-empty">无标签</span>
                  {/if}
                </div>

                <div class="meta-item">
                  <Icon icon="lucide:clock" class="meta-icon" />
                  <span>预计 {task.estimateMinutes || '-'} 分钟</span>
                </div>

                {#if task.actualMinutes}
                  <div class="meta-item">
                    <Icon icon="lucide:check-circle-2" class="meta-icon" />
                    <span>实际 {task.actualMinutes} 分钟</span>
                  </div>
                {/if}

                {#if task.dueDate}
                  <div class="meta-item">
                    <Icon icon="lucide:calendar" class="meta-icon" />
                    <span>{task.dueDate}</span>
                  </div>
                {/if}

                {#if task.postponeCount > 0}
                  <div class="meta-item meta-item--warning">
                    <Icon icon="lucide:rotate-ccw" class="meta-icon" />
                    <span>已推迟 {task.postponeCount} 次</span>
                  </div>
                {/if}
              </div>

              <div class="task-details-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onclick={() => openEditTaskForm(task)}
                >
                  <Icon icon="lucide:edit" />
                  编辑
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onclick={() => handleTaskDelete(task)}
                  aria-label="删除任务"
                >
                  <Icon icon="lucide:trash-2" />
                </Button>
                {#if task.status === 'pending'}
                  <Button
                    variant="primary"
                    size="sm"
                    onclick={() => handleTaskStart(task)}
                    aria-label="开始任务"
                  >
                    <Icon icon="lucide:play" />
                  </Button>
                {:else if task.status === 'in_progress'}
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
      </TaskList>
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

  <!-- Task Timer Modal -->
  {#if showTaskTimer && taskStore.currentTask}
    <div class="timer-modal-backdrop">
      <div class="timer-modal">
        <TaskTimer
          task={taskStore.currentTask}
          onPause={handleTaskPause}
          oncomplete={handleTaskComplete}
        />
        <button
          class="timer-close"
          onclick={() => showTaskTimer = false}
          aria-label="关闭计时器"
        >
          <Icon icon="lucide:x" />
        </button>
      </div>
    </div>
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

  .back-button:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  .header-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
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

  .task-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .task-details-content {
    flex: 1;
  }

  .task-details-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .task-details-description {
    color: #6b7280;
    line-height: 1.6;
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
    padding: 0.25rem 0.5rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 0.375rem;
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

  @media (max-width: 768px) {
    .task-details {
      gap: 0.75rem;
    }

    .task-details-actions {
      flex-wrap: wrap;
    }
  }
</style>
