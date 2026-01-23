<script lang="ts">
  import { onMount, onDestroy } from 'svelte/runes'
  import Icon from '@iconify/svelte'
  import Button from '../ui/Button.svelte'
  import type { Task } from '../../api/types'

  interface Props {
    task: Task
    onPause?: () => void
    oncomplete?: () => void
  }

  let {
    task,
    onPause,
    oncomplete,
  }: Props = $props()

  // Local timer state
  let localSeconds = $state(0)
  let isRunning = $state(false)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  // Format time as MM:SS
  const formattedTime = $derived(() => {
    const minutes = Math.floor(localSeconds / 60)
    const seconds = localSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  // Calculate progress percentage
  const progressPercent = $derived(() => {
    if (!task.estimateMinutes) return 0
    const percent = (localSeconds / task.estimateMinutes) * 100
    return Math.min(percent, 100)
  })

  /**
   * Format seconds to readable time
   */
  function formatTotalTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}小时${minutes}分`
    }
    if (minutes > 0) {
      return `${minutes}分${secs}秒`
    }
    return `${secs}秒`
  }

  /**
   * Start timer
   */
  function startTimer(): void {
    if (isRunning) return

    isRunning = true
    timerInterval = setInterval(() => {
      localSeconds++
    }, 1000)
  }

  /**
   * Pause timer
   */
  function pauseTimer(): void {
    if (!isRunning) return

    isRunning = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    onPause?.()
  }

  /**
   * Complete task
   */
  async function handleComplete(): Promise<void> {
    pauseTimer()
    await oncomplete?.()
  }

  /**
   * Initialize with store state
   */
  onMount(() => {
    // Start with store's timer state
    isRunning = task.status === 'in_progress'
    localSeconds = task.actualMinutes ? task.actualMinutes * 60 : 0

    if (isRunning) {
      startTimer()
    }
  })

  /**
   * Cleanup
   */
  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })
</script>

<div class="task-timer">
  <div class="timer-circle">
    <svg class="timer-progress" viewBox="0 0 100 100">
      <circle
        class="timer-background"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="8"
      />
      <circle
        class="timer-foreground"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#3b82f6"
        stroke-width="8"
        stroke-dasharray={283}
        stroke-dashoffset={283 - (283 * progressPercent / 100)}
        transform="rotate(-90deg)"
        style:transition: stroke-dashoffset 1s linear"
      />
    </svg>
    <div class="timer-center">
      <Icon icon="lucide:clock" class="timer-icon" />
      <span class="timer-display">{formattedTime}</span>
    </div>
  </div>

  <div class="timer-info">
    <div class="timer-info-item">
      <span class="info-label">任务</span>
      <span class="info-value">{task.title}</span>
    </div>

    {#if task.estimateMinutes}
      <div class="timer-info-item">
        <span class="info-label">预计</span>
        <span class="info-value">{task.estimateMinutes} 分钟</span>
      </div>
    {/if}

    <div class="timer-info-item">
      <span class="info-label">累计</span>
      <span class="info-value">{formatTotalTime(localSeconds)}</span>
    </div>
  </div>

  <div class="timer-actions">
    {#if !isRunning}
      <Button
        variant="primary"
        size="lg"
        onclick={startTimer}
        aria-label="开始计时"
      >
        <Icon icon="lucide:play" />
        开始
      </Button>
    {:else}
      <Button
        variant="secondary"
        size="lg"
        onclick={pauseTimer}
        aria-label="暂停计时"
      >
        <Icon icon="lucide:pause" />
        暂停
      </Button>
    {/if}

    <Button
      variant="success"
      size="lg"
      onclick={handleComplete}
      aria-label="完成任务"
    >
      <Icon icon="lucide:check" />
      完成
    </Button>
  </div>
</div>

<style>
  .task-timer {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }

  .timer-circle {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }

  .timer-progress {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .timer-background {
    transition: stroke 0.3s;
  }

  .timer-foreground {
    transition: stroke-dashoffset 1s linear, stroke 0.3s;
  }

  .timer-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .timer-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
  }

  .timer-display {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    font-variant-numeric: tabular-nums;
  }

  .timer-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .timer-info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
    width: 3rem;
  }

  .info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .timer-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .task-timer {
      padding: 1.5rem;
    }

    .timer-circle {
      width: 150px;
      height: 150px;
    }

    .timer-display {
      font-size: 2rem;
    }

    .timer-actions {
      flex-direction: column;
    }

    .timer-actions button {
      width: 100%;
    }
  }
</style>
