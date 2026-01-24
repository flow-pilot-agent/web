<script lang="ts">
  import Icon from '@iconify/svelte'
  import Button from '../ui/Button.svelte'
  import Card from '../ui/Card.svelte'
  import type { Task } from '../../api/types'
  import type { Snippet } from 'svelte'

  interface Props {
    task: Task
    onclick?: (task: Task) => void
    ondelete?: () => void
    onstart?: () => void
    onpause?: () => void
    oncomplete?: () => void
    showActions?: boolean
    children?: Snippet
  }

  let {
    task,
    onclick,
    ondelete,
    onstart,
    onpause,
    oncomplete,
    showActions = true,
    children,
  }: Props = $props()

  const isCompleted = $derived(task.status === 'completed')
  const isInProgress = $derived(task.status === 'in_progress')
  const isPending = $derived(task.status === 'pending')

  /**
   * Get priority badge color
   */
  function getPriorityBadgeColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  /**
   * Get priority label
   */
  function getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high':
        return '高优先级'
      case 'medium':
        return '中优先级'
      case 'low':
        return '低优先级'
      default:
        return '未知'
    }
  }

  /**
   * Get status label
   */
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'in_progress':
        return '进行中'
      case 'completed':
        return '已完成'
      default:
        return '未知'
    }
  }

  /**
   * Check if task is overdue
   */
  function isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate || task.status === 'completed') return false
    return new Date(dueDate) < new Date()
  }

  /**
   * Format due date
   */
  function formatDueDate(dueDate: string | undefined): string {
    if (!dueDate) return '无截止日期'
    const date = new Date(dueDate)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天截止'
    if (days === 1) return '明天截止'
    if (days < 0) return `${Math.abs(days)} 天前逾期`
    return `${days} 天后截止`
  }

  /**
   * Handle card click
   */
  function handleClick(): void {
    onclick?.(task)
  }

  /**
   * Handle action button clicks - prevent event propagation
   */
  function handleActionClick(event: MouseEvent, action: () => void): void {
    event.stopPropagation()
    action()
  }
</script>

<Card
  class="task-card {isCompleted ? 'completed' : ''} {isPending ? 'pending' : ''}"
  onclick={showActions ? handleClick : undefined}
>
  <div class="task-card-header">
    <div class="task-card-priority">
      <span class={`priority-badge ${getPriorityBadgeColor(task.priority)}`}>
        {getPriorityLabel(task.priority)}
      </span>
    </div>
    <div class="task-card-status">
      <span class={`status-indicator ${task.status}`}>
        <span class="status-dot"></span>
        <span class="status-label">{getStatusLabel(task.status)}</span>
      </span>
    </div>
    {#if task.dueDate}
      <div class="task-card-due-date {isOverdue(task.dueDate) ? 'overdue' : ''}">
        <Icon icon="lucide:calendar" class="due-date-icon" />
        <span class="due-date-text">{formatDueDate(task.dueDate)}</span>
      </div>
    {/if}
  </div>

  <div class="task-card-body">
    <h3 class="task-title">{task.title}</h3>
    {#if task.description}
      <p class="task-description">{task.description}</p>
    {/if}

    <div class="task-card-footer">
      {#if task.tags && task.tags.length > 0}
        <div class="task-tags">
          {#each task.tags as tag (tag)}
            <span class="task-tag">{tag}</span>
          {/each}
        </div>
      {/if}

      {#if task.estimateMinutes}
        <div class="task-estimate">
          <Icon icon="lucide:clock" class="estimate-icon" />
          <span class="estimate-text">预计 {task.estimateMinutes} 分钟</span>
        </div>
      {/if}

      {#if task.actualMinutes}
        <div class="task-actual">
          <Icon icon="lucide:check-circle-2" class="actual-icon" />
          <span class="actual-text">实际 {task.actualMinutes} 分钟</span>
        </div>
      {/if}
    </div>
  </div>

  {#if showActions}
    <div class="task-card-actions">
      {#if isPending}
        <Button
          variant="primary"
          size="sm"
          onclick={(e) => handleActionClick(e, () => onstart?.())}
          aria-label="开始任务"
        >
          <Icon icon="lucide:play" />
        </Button>
      {:else if isInProgress}
        <Button
          variant="secondary"
          size="sm"
          onclick={(e) => handleActionClick(e, () => onpause?.())}
          aria-label="暂停任务"
        >
          <Icon icon="lucide:pause" />
        </Button>
      {/if}

      {#if !isCompleted}
        <Button
          variant="success"
          size="sm"
          onclick={(e) => handleActionClick(e, () => oncomplete?.())}
          aria-label="完成任务"
        >
          <Icon icon="lucide:check" />
        </Button>
      {/if}

      <Button
        variant="danger"
        size="sm"
        onclick={(e) => handleActionClick(e, () => ondelete?.())}
        aria-label="删除任务"
      >
        <Icon icon="lucide:trash-2" />
      </Button>
    </div>
  {/if}

  {#if children}
    <div class="task-card-children">
      {@render children()}
    </div>
  {/if}
</Card>

<style>
  .task-card {
    border-left: 4px solid transparent;
    transition: all 0.2s ease;
  }

  .task-card.pending {
    border-left-color: #f59e0b;
  }

  .task-card.in_progress {
    border-left-color: #3b82f6;
  }

  .task-card.completed {
    border-left-color: #10b981;
    opacity: 0.7;
  }

  .task-card:hover:not(.completed) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .task-card:hover:not(.completed) {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }

  .task-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .task-card-priority {
    flex-shrink: 0;
  }

  .priority-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .task-card-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
  }

  .status-indicator.pending .status-dot {
    background-color: #f59e0b;
  }

  .status-indicator.in_progress .status-dot {
    background-color: #3b82f6;
    animation: pulse 2s infinite;
  }

  .status-indicator.completed .status-dot {
    background-color: #10b981;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .status-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  @media (prefers-color-scheme: dark) {
    .status-label {
      color: #9ca3af;
    }
  }

  .task-card-due-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    background-color: #f9fafb;
    font-size: 0.75rem;
  }

  @media (prefers-color-scheme: dark) {
    .task-card-due-date {
      background-color: #374151;
      color: #d1d5db;
    }
  }

  .task-card-due-date.overdue {
    background-color: #fef2f2;
    color: #dc2626;
  }

  @media (prefers-color-scheme: dark) {
    .task-card-due-date.overdue {
      background-color: #7f1d1d;
      color: #fca5a5;
    }
  }

  .due-date-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  .task-card-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    line-height: 1.5;
    margin: 0;
  }

  @media (prefers-color-scheme: dark) {
    .task-title {
      color: #f9fafb;
    }
  }

  .task-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (prefers-color-scheme: dark) {
    .task-description {
      color: #9ca3af;
    }
  }

  .task-card-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .task-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .task-tag {
    padding: 0.25rem 0.625rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 0.75rem;
  }

  @media (prefers-color-scheme: dark) {
    .task-tag {
      background-color: #164e63;
      color: #7dd3fc;
    }
  }

  .task-estimate,
  .task-actual {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  @media (prefers-color-scheme: dark) {
    .task-estimate,
    .task-actual {
      color: #9ca3af;
    }
  }

  .estimate-icon,
  .actual-icon {
    width: 1rem;
    height: 1rem;
  }

  .task-card-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .task-card-actions {
      border-top-color: #374151;
    }
  }

  .task-card-children {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .task-card-children {
      border-top-color: #374151;
    }
  }
</style>
