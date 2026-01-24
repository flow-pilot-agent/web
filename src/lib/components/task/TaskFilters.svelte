<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { TaskFilters, TaskPriority, TaskStatus } from '../../stores/taskStore.svelte'

  interface Props {
    filter: TaskFilters
    setFilter: (filter: TaskFilters) => void
  }

  let {
    filter,
    setFilter,
  }: Props = $props()

  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待处理' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
  ]

  const priorityOptions = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高优先级' },
    { value: 'medium', label: '中优先级' },
    { value: 'low', label: '低优先级' },
  ]

  /**
   * Handle status filter change
   */
  function handleStatusChange(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value as TaskStatus | 'all'
    setFilter({ ...filter, status: value })
  }

  /**
   * Handle priority filter change
   */
  function handlePriorityChange(event: Event & { currentTarget: HTMLSelectElement }): void {
    const value = event.currentTarget.value as TaskPriority | 'all'
    setFilter({ ...filter, priority: value })
  }

  /**
   * Handle search input
   */
  function handleSearchInput(event: Event & { currentTarget: HTMLInputElement }): void {
    setFilter({ ...filter, searchQuery: event.currentTarget.value })
  }

  /**
   * Clear filters
   */
  function clearFilters(): void {
    setFilter({ status: 'all', priority: 'all', searchQuery: '' })
  }

  /**
   * Check if filters are active
   */
  const hasActiveFilters = $derived(
    filter.status !== 'all' || filter.priority !== 'all' || filter.searchQuery !== ''
  )
</script>

<div class="task-filters">
  <!-- Status Filter -->
  <div class="filter-group">
    <label class="filter-label">
      <Icon icon="lucide:filter" class="filter-icon" />
      状态
    </label>
    <select
      class="filter-select"
      value={filter.status || 'all'}
      onchange={handleStatusChange}
    >
      {#each statusOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <!-- Priority Filter -->
  <div class="filter-group">
    <label class="filter-label">
      <Icon icon="lucide:bar-chart-2" class="filter-icon" />
      优先级
    </label>
    <select
      class="filter-select"
      value={filter.priority || 'all'}
      onchange={handlePriorityChange}
    >
      {#each priorityOptions as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <!-- Search -->
  <div class="filter-group filter-group--search">
    <label class="filter-label">
      <Icon icon="lucide:search" class="filter-icon" />
    </label>
    <input
      type="text"
      class="filter-input"
      placeholder="搜索任务..."
      value={filter.searchQuery}
      oninput={handleSearchInput}
    />
  </div>

  <!-- Clear Filters -->
  {#if hasActiveFilters}
    <button
      class="clear-filters-button"
      onclick={clearFilters}
      aria-label="清除筛选"
    >
      <Icon icon="lucide:x" />
      清除
    </button>
  {/if}
</div>

<style>
  .task-filters {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .task-filters {
      background-color: #1f2937;
      border-color: #374151;
    }
  }

  :global(.dark) .task-filters {
    background-color: #1f2937;
    border-color: #374151;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-group--search {
    flex: 1;
    min-width: 200px;
  }

  .filter-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  @media (prefers-color-scheme: dark) {
    .filter-label {
      color: #d1d5db;
    }
  }

  :global(.dark) .filter-label {
    color: #d1d5db;
  }

  .filter-icon {
    width: 1rem;
    height: 1rem;
  }

  .filter-select {
    padding: 0.5rem 2rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: white;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.15s;
  }

  @media (prefers-color-scheme: dark) {
    .filter-select {
      background-color: #374151;
      border-color: #4b5563;
      color: #d1d5db;
    }
  }

  :global(.dark) .filter-select {
    background-color: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }

  .filter-select:hover {
    border-color: #9ca3af;
  }

  @media (prefers-color-scheme: dark) {
    .filter-select:hover {
      border-color: #6b7280;
    }
  }

  :global(.dark) .filter-select:hover {
    border-color: #6b7280;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    .filter-select:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }
  }

  :global(.dark) .filter-select:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  .filter-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.15s;
  }

  @media (prefers-color-scheme: dark) {
    .filter-input {
      background-color: #374151;
      border-color: #4b5563;
      color: #d1d5db;
    }

    .filter-input::placeholder {
      color: #9ca3af;
    }
  }

  :global(.dark) .filter-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }

  :global(.dark) .filter-input::placeholder {
    color: #9ca3af;
  }

  .filter-input:hover {
    border-color: #9ca3af;
  }

  @media (prefers-color-scheme: dark) {
    .filter-input:hover {
      border-color: #6b7280;
    }
  }

  :global(.dark) .filter-input:hover {
    border-color: #6b7280;
  }

  .filter-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    .filter-input:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
    }
  }

  :global(.dark) .filter-input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  .filter-input::placeholder {
    color: #9ca3af;
  }

  .clear-filters-button {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  @media (prefers-color-scheme: dark) {
    .clear-filters-button {
      background-color: #374151;
      color: #d1d5db;
    }
  }

  :global(.dark) .clear-filters-button {
    background-color: #374151;
    color: #d1d5db;
  }

  .clear-filters-button:hover {
    background-color: #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .clear-filters-button:hover {
      background-color: #4b5563;
    }
  }

  :global(.dark) .clear-filters-button:hover {
    background-color: #4b5563;
  }

  .clear-filters-button:hover {
    background-color: #2563eb;
  }

  .clear-filters-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 640px) {
    .task-filters {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-group {
      width: 100%;
    }

    .filter-group--search {
      min-width: auto;
    }
  }
</style>
