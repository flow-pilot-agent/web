<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { TaskFilters, TaskPriority, TaskStatus } from '../../stores/taskStore.svelte'

  interface Props {
    filter: TaskFilters
    setFilter: (filter: TaskFilters) => void
  }

  let { filter, setFilter }: Props = $props()

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
   * Handle status change
   */
  function handleStatusChange(event: Event & { currentTarget: HTMLSelectElement }): void {
    const status = event.currentTarget.value as TaskStatus | 'all'
    setFilter({ ...filter, status })
  }

  /**
   * Handle priority change
   */
  function handlePriorityChange(event: Event & { currentTarget: HTMLSelectElement }): void {
    const priority = event.currentTarget.value as TaskPriority | 'all'
    setFilter({ ...filter, priority })
  }

  /**
   * Handle search input
   */
  function handleSearchInput(event: Event & { currentTarget: HTMLInputElement }): void {
    setFilter({ ...filter, searchQuery: event.currentTarget.value })
  }

  /**
   * Clear all filters
   */
  function clearFilters(): void {
    setFilter({
      status: 'all',
      priority: 'all',
      searchQuery: '',
    })
  }

  /**
   * Check if filters are active
   */
  const hasActiveFilters = $derived(
    filter.status !== 'all' || filter.priority !== 'all' || filter.searchQuery !== ''
  )
</script>

<div class="task-filters bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <!-- Status Filter -->
  <div class="filter-group">
    <label class="filter-label text-gray-700 dark:text-gray-300">
      <Icon icon="lucide:filter" class="w-4 h-4" />
      状态
    </label>
    <select
      class="filter-select bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
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
    <label class="filter-label text-gray-700 dark:text-gray-300">
      <Icon icon="lucide:bar-chart-2" class="w-4 h-4" />
      优先级
    </label>
    <select
      class="filter-select bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
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
    <label class="filter-label text-gray-700 dark:text-gray-300">
      <Icon icon="lucide:search" class="w-4 h-4" />
    </label>
    <input
      type="text"
      class="filter-input bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
      placeholder="搜索任务..."
      value={filter.searchQuery}
      oninput={handleSearchInput}
    />
  </div>

  <!-- Clear Filters -->
  {#if hasActiveFilters}
    <button
      class="clear-filters-button bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      onclick={clearFilters}
      aria-label="清除筛选"
    >
      <Icon icon="lucide:x" class="w-4 h-4" />
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
    border-radius: 0.75rem;
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
  }

  .filter-select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .filter-select:hover {
    border-color: #9ca3af;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .filter-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.15s;
  }

  .filter-input:hover {
    border-color: #9ca3af;
  }

  .filter-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .clear-filters-button {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
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
