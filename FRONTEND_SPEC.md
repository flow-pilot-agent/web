# FlowPilot Frontend Specification

**版本**: 0.1
**日期**: 2026-01-18
**作者**: Claude (PM/Tech Lead)
**关联文档**: [AGENTS.md](./AGENTS.md), [SRS](../document/srs-user-story.md)

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [开发阶段规划](#3-开发阶段规划)
4. [组件设计](#4-组件设计)
5. [状态管理](#5-状态管理)
6. [API Mock 策略](#6-api-mock-策略)
7. [UI/UX 设计规范](#7-uiux-设计规范)
8. [测试策略](#8-测试策略)
9. [验收标准](#9-验收标准)

---

## 1. 项目概述

### 1.1 目标

开发 FlowPilot 前端应用，实现 MVP 阶段的核心功能：

- 用户认证 (登录/注册)
- 任务管理 (CRUD + 计时器)
- Agent 推荐 ("现在该做什么")
- 拖延介入提醒
- 每日复盘

### 1.2 约束条件

- **纯前端开发**: 后端由他人负责，前端使用 Mock API
- **Svelte 5**: 使用最新的 Runes API
- **非 SvelteKit**: 使用 Vite 作为构建工具
- **LLM**: 后端集成 OpenAI 模型
- **响应式**: 支持桌面端和移动端

### 1.3 成功标准

- UI 美观、流畅、符合现代 Web 应用标准
- 组件可复用性强
- 代码质量高，测试覆盖率达标
- 可轻松与后端 API 集成 (通过切换 Mock 开关)

---

## 2. 技术栈

### 2.1 核心框架

| 技术       | 版本    | 用途     |
| ---------- | ------- | -------- |
| Svelte     | 5.43.8+ | UI 框架  |
| TypeScript | 5.9.3+  | 类型安全 |
| Vite       | 7.2.4+  | 构建工具 |

### 2.2 UI 组件库

| 库            | 用途                          |
| ------------- | ----------------------------- |
| Bits UI       | Headless UI 组件 (Accessible) |
| Tailwind CSS  | 样式工具                      |
| Lucide Svelte | 图标库                        |

### 2.3 工具库

| 库                     | 用途                  |
| ---------------------- | --------------------- |
| date-fns               | 日期处理              |
| zod                    | 表单验证              |
| @tanstack/svelte-query | 数据获取与缓存 (可选) |

### 2.4 开发工具

| 工具                    | 用途       |
| ----------------------- | ---------- |
| Vitest                  | 单元测试   |
| @testing-library/svelte | 组件测试   |
| ESLint                  | 代码检查   |
| Prettier                | 代码格式化 |

---

## 3. 开发阶段规划

### Phase 0: 基础设施搭建 (Day 1-2)

**目标**: 配置开发环境和项目结构

**任务**:

- ✅ 安装开发工具链 (Vitest, ESLint, Prettier, Tailwind)
- ✅ 创建标准目录结构
- ✅ 配置 TypeScript 严格模式
- ✅ 创建基础 UI 组件 (Button, Input, Modal, Card)
- ✅ 配置 Mock API Client

**交付物**:

- `package.json` (所有依赖已安装)
- 配置文件 (vitest.config.ts, .eslintrc.cjs, tailwind.config.js)
- 基础组件库 (src/lib/components/ui/)
- Mock API Client (src/lib/api/mock.ts)

---

### Phase 1.1: 用户认证 UI (Day 3-4)

**功能范围**: 登录和注册页面

**组件**:

- `LoginPage.svelte` - 登录页面
- `RegisterPage.svelte` - 注册页面
- `AuthForm.svelte` - 通用认证表单组件

**状态管理**:

- `authStore.ts` - 用户状态、Token 管理

**验收标准**:

- 用户可以输入邮箱和密码
- 表单验证正确 (邮箱格式、密码长度)
- 登录成功后存储 Token 并跳转
- 登录失败显示错误提示
- Mock API 可以模拟成功/失败场景

---

### Phase 1.2: 任务管理 UI (Day 5-8)

**功能范围**: 任务列表、创建、编辑、删除、计时器

**组件**:

- `TaskList.svelte` - 任务列表容器
- `TaskCard.svelte` - 单个任务卡片
- `TaskForm.svelte` - 创建/编辑任务表单
- `TaskTimer.svelte` - 任务计时器 (Pomodoro 风格)
- `TaskFilters.svelte` - 任务筛选器 (状态、优先级)

**状态管理**:

- `taskStore.ts` - 任务列表、当前任务、计时器状态

**验收标准**:

- 显示任务列表 (标题、优先级、状态、截止日期)
- 可以创建新任务 (填写标题、优先级、预计时长)
- 可以编辑任务
- 可以删除任务
- 可以开始/暂停/完成任务
- 计时器正确运行并显示时间
- 支持按状态和优先级筛选

---

### Phase 1.3: Agent 推荐 UI (Day 9-11)

**功能范围**: "现在该做什么" 推荐页面

**组件**:

- `RecommendationPage.svelte` - 推荐主页面
- `RecommendationCard.svelte` - 推荐结果卡片
- `StreamingText.svelte` - 流式文本显示组件
- `AlternativeTaskList.svelte` - 备选任务列表

**状态管理**:

- `agentStore.ts` - 推荐历史、当前推荐

**API 集成**:

- Mock SSE (Server-Sent Events) 流式响应

**验收标准**:

- 用户点击"现在该做什么"按钮
- 显示加载状态
- 流式显示推荐文本 (模拟打字效果)
- 显示推荐任务、理由、预计时长
- 显示备选任务 (可选)
- 用户可一键开始推荐任务

---

### Phase 1.4: 拖延介入 UI (Day 12-14)

**功能范围**: 介入弹窗、心跳监测

**组件**:

- `InterventionModal.svelte` - 介入弹窗
- `SubTaskList.svelte` - 子任务列表
- `ActivityMonitor.svelte` - 活动监测组件 (隐藏)

**状态管理**:

- `interventionStore.ts` - 介入历史、用户响应

**功能实现**:

- 前端心跳机制 (每 5 分钟发送一次)
- 模拟闲置 30 分钟后触发介入

**验收标准**:

- 闲置 30 分钟后弹出介入窗口
- 显示介入消息和拆分后的子任务
- 用户可选择: 立即处理 / 延迟 15 分钟 / 今天不再提醒
- 点击"立即处理"后开始任务

---

### Phase 1.5: 每日复盘 UI (Day 15-17)

**功能范围**: 复盘页面、问题回答、建议展示

**组件**:

- `ReviewPage.svelte` - 复盘主页面
- `ReviewQuestion.svelte` - 复盘问题卡片
- `ReviewSuggestions.svelte` - Agent 建议展示
- `ReviewHistory.svelte` - 复盘历史列表

**状态管理**:

- `reviewStore.ts` - 复盘状态、历史记录

**验收标准**:

- 显示 3 个复盘问题
- 用户可以输入答案
- 提交后显示 Agent 生成的改进建议
- 显示当日统计数据 (完成任务数、专注时长、拖延次数)
- 可以查看历史复盘记录

---

## 4. 组件设计

### 4.1 组件层级结构

```
App.svelte
├── Router (手动实现)
│   ├── LoginPage.svelte
│   ├── RegisterPage.svelte
│   ├── DashboardLayout.svelte
│   │   ├── Sidebar.svelte
│   │   ├── TopBar.svelte
│   │   └── MainContent
│   │       ├── TaskListPage.svelte
│   │       │   ├── TaskFilters.svelte
│   │       │   ├── TaskList.svelte
│   │       │   │   └── TaskCard.svelte
│   │       │   └── TaskForm.svelte (Modal)
│   │       ├── RecommendationPage.svelte
│   │       │   ├── RecommendationCard.svelte
│   │       │   │   └── StreamingText.svelte
│   │       │   └── AlternativeTaskList.svelte
│   │       ├── ReviewPage.svelte
│   │       │   ├── ReviewQuestion.svelte
│   │       │   ├── ReviewSuggestions.svelte
│   │       │   └── ReviewHistory.svelte
│   │       └── SettingsPage.svelte
│   └── InterventionModal.svelte (Global)
└── ToastNotification.svelte (Global)
```

### 4.2 基础 UI 组件规范

所有基础组件位于 `src/lib/components/ui/`，遵循以下规范:

#### Button.svelte

```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}
```

#### Input.svelte

```typescript
interface Props {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value: string
  disabled?: boolean
  error?: string
  label?: string
}
```

#### Modal.svelte

```typescript
interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}
```

#### Card.svelte

```typescript
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
}
```

---

## 5. 状态管理

### 5.1 Svelte 5 Runes 状态管理模式

使用 Svelte 5 的 `$state` 和 `$derived` runes 实现状态管理。

### 5.2 Store 设计

#### authStore.ts

```typescript
import { $state } from 'svelte/runes'

interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
}

class AuthStore {
  user = $state<User | null>(null)
  accessToken = $state<string | null>(null)
  isAuthenticated = $derived(this.user !== null)

  async login(email: string, password: string): Promise<void>
  async register(email: string, password: string, displayName: string): Promise<void>
  async logout(): Promise<void>
  async refreshToken(): Promise<void>
}

export const authStore = new AuthStore()
```

#### taskStore.ts

```typescript
import { $state } from 'svelte/runes'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  tags: string[]
  estimateMinutes?: number
  actualMinutes?: number
  dueDate?: string
  completedAt?: string
  postponeCount: number
  createdAt: string
  updatedAt: string
}

interface TaskSession {
  id: string
  taskId: string
  startTs: string
  endTs?: string
  durationMinutes?: number
  pauseCount: number
}

class TaskStore {
  tasks = $state<Task[]>([])
  currentTask = $state<Task | null>(null)
  currentSession = $state<TaskSession | null>(null)
  loading = $state(false)
  error = $state<string | null>(null)

  // Filters
  statusFilter = $state<Task['status'] | 'all'>('all')
  priorityFilter = $state<Task['priority'] | 'all'>('all')

  // Derived
  filteredTasks = $derived(() => {
    return this.tasks.filter(task => {
      if (this.statusFilter !== 'all' && task.status !== this.statusFilter) return false
      if (this.priorityFilter !== 'all' && task.priority !== this.priorityFilter) return false
      return true
    })
  })

  async fetchTasks(): Promise<void>
  async createTask(data: CreateTaskInput): Promise<Task>
  async updateTask(id: string, data: UpdateTaskInput): Promise<Task>
  async deleteTask(id: string): Promise<void>
  async startTask(id: string): Promise<TaskSession>
  async pauseTask(): Promise<void>
  async completeTask(): Promise<void>
}

export const taskStore = new TaskStore()
```

#### agentStore.ts

```typescript
interface Recommendation {
  id: string
  recommendedTask: Task
  rationale: string
  suggestedDuration: number
  alternatives: Array<{
    taskId: string
    title: string
    reason: string
  }>
  timestamp: string
}

class AgentStore {
  currentRecommendation = $state<Recommendation | null>(null)
  history = $state<Recommendation[]>([])
  loading = $state(false)
  error = $state<string | null>(null)

  async getRecommendation(availableMinutes?: number, context?: string): Promise<Recommendation>
  async provideFeedback(decisionId: string, adopted: boolean): Promise<void>
}

export const agentStore = new AgentStore()
```

---

## 6. API Mock 策略

### 6.1 Mock API Client

创建 `src/lib/api/client.ts`:

```typescript
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

export const apiClient = {
  get: async (url: string) => {
    if (USE_MOCK) {
      return mockApi.get(url)
    }
    return fetch(API_BASE_URL + url).then(r => r.json())
  },
  post: async (url: string, data: any) => {
    if (USE_MOCK) {
      return mockApi.post(url, data)
    }
    return fetch(API_BASE_URL + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json())
  },
  // ... PUT, DELETE, PATCH
}
```

### 6.2 Mock 数据

创建 `src/lib/api/mock.ts`:

```typescript
export const mockApi = {
  // Mock Auth
  'POST /api/v1/auth/login': async data => {
    await delay(500)
    if (data.email === 'test@example.com' && data.password === 'password') {
      return {
        user: { id: '1', email: 'test@example.com', displayName: 'Test User' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }
    }
    throw new Error('Invalid credentials')
  },

  // Mock Tasks
  'GET /api/v1/tasks': async () => {
    await delay(300)
    return {
      tasks: mockTasks,
      pagination: { page: 1, limit: 20, total: mockTasks.length },
    }
  },

  'POST /api/v1/tasks': async data => {
    await delay(400)
    const newTask = {
      id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockTasks.push(newTask)
    return newTask
  },

  // Mock Agent Recommendation (with SSE simulation)
  'POST /api/v1/agent/recommend': async data => {
    await delay(1000)
    return {
      id: Date.now().toString(),
      recommendedTask: mockTasks[0],
      rationale: '你现在有60分钟可用时间，建议先处理这个高优先级任务。',
      suggestedDuration: 45,
      alternatives: [],
    }
  },
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: '完成项目文档',
    priority: 'high',
    status: 'pending',
    estimateMinutes: 120,
    dueDate: '2026-01-20T10:00:00Z',
    tags: ['work'],
    postponeCount: 0,
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  // ... more mock tasks
]
```

### 6.3 环境变量

`.env`:

```bash
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 7. UI/UX 设计规范

### 7.1 设计原则

1. **简洁**: 避免过度设计，专注核心功能
2. **一致**: 组件风格统一，交互模式一致
3. **反馈**: 所有操作都有明确的视觉反馈
4. **无障碍**: 符合 WCAG 2.1 AA 标准

### 7.2 颜色方案

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          700: '#374151',
          900: '#111827',
        },
      },
    },
  },
}
```

### 7.3 排版

- **字体**: 系统字体栈 (SF Pro, Segoe UI, Roboto)
- **字号**: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl)
- **行高**: 1.5 (正文), 1.2 (标题)
- **字重**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### 7.4 间距

使用 Tailwind 的 spacing scale (4px 基准):

- **xs**: 4px (p-1)
- **sm**: 8px (p-2)
- **md**: 16px (p-4)
- **lg**: 24px (p-6)
- **xl**: 32px (p-8)

### 7.5 圆角

- **sm**: 4px (rounded-sm)
- **md**: 8px (rounded-md)
- **lg**: 12px (rounded-lg)
- **full**: 9999px (rounded-full)

### 7.6 阴影

- **sm**: `shadow-sm` - 微小阴影
- **md**: `shadow-md` - 卡片阴影
- **lg**: `shadow-lg` - 悬浮阴影

### 7.7 响应式断点

```javascript
sm: '640px',   // 移动端
md: '768px',   // 平板
lg: '1024px',  // 桌面端
xl: '1280px',  // 大屏
```

### 7.8 动画

```javascript
// 使用 Tailwind 的 transition
transition - colors // 颜色过渡
transition - opacity // 透明度过渡
transition - transform // 变换过渡

// 时长
duration - 150 // 150ms
duration - 300 // 300ms (默认)
```

---

## 8. 测试策略

### 8.1 测试层级

1. **单元测试**: 工具函数、业务逻辑
2. **组件测试**: UI 组件渲染和交互
3. **集成测试**: Store + API 集成

### 8.2 测试覆盖率目标

- 工具函数: ≥ 90%
- Stores: ≥ 80%
- UI 组件: ≥ 60%

### 8.3 测试示例

#### 工具函数测试

```typescript
// src/lib/utils/date.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, isOverdue } from './date'

describe('date utils', () => {
  it('formats date correctly', () => {
    const date = new Date('2026-01-15T10:00:00Z')
    expect(formatDate(date)).toBe('2026年1月15日')
  })

  it('detects overdue tasks', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
    expect(isOverdue(pastDate)).toBe(true)
  })
})
```

#### 组件测试

```typescript
// src/lib/components/task/TaskCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import TaskCard from './TaskCard.svelte'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    priority: 'high',
    status: 'pending',
  }

  it('renders task title', () => {
    const { getByText } = render(TaskCard, { props: { task: mockTask } })
    expect(getByText('Test Task')).toBeTruthy()
  })

  it('emits start event when button clicked', async () => {
    const { getByText, component } = render(TaskCard, { props: { task: mockTask } })
    const handler = vi.fn()
    component.$on('start', handler)

    await fireEvent.click(getByText('开始'))
    expect(handler).toHaveBeenCalled()
  })
})
```

---

## 9. 验收标准

### 9.1 Phase 0 验收标准

- ✅ `pnpm dev` 可以启动开发服务器
- ✅ `pnpm test` 可以运行测试
- ✅ `pnpm lint` 通过检查
- ✅ `pnpm check` TypeScript 类型检查通过
- ✅ Tailwind CSS 样式生效
- ✅ 基础 UI 组件可用 (Button, Input, Modal, Card)

### 9.2 Phase 1.1 验收标准 (用户认证)

- ✅ 登录页面 UI 美观
- ✅ 输入验证正确 (邮箱格式、密码长度 ≥ 8)
- ✅ 登录成功后存储 Token
- ✅ 登录失败显示错误提示
- ✅ 注册流程完整
- ✅ 组件测试覆盖率 ≥ 60%

### 9.3 Phase 1.2 验收标准 (任务管理)

- ✅ 任务列表正确显示
- ✅ 可以创建、编辑、删除任务
- ✅ 计时器功能正常 (开始、暂停、完成)
- ✅ 任务筛选器工作正常
- ✅ 响应式布局 (移动端 + 桌面端)
- ✅ 组件测试覆盖率 ≥ 60%

### 9.4 Phase 1.3 验收标准 (Agent 推荐)

- ✅ 点击"现在该做什么"按钮触发推荐
- ✅ 显示加载状态 (骨架屏)
- ✅ 推荐文本流式显示 (模拟打字效果)
- ✅ 显示推荐任务、理由、时长
- ✅ 用户可一键开始任务
- ✅ 组件测试覆盖率 ≥ 60%

### 9.5 Phase 1.4 验收标准 (拖延介入)

- ✅ 心跳机制正常工作
- ✅ 模拟闲置 30 分钟后触发介入
- ✅ 介入弹窗显示正确
- ✅ 用户可选择延迟/立即处理/不再提醒
- ✅ 子任务列表显示正确
- ✅ 组件测试覆盖率 ≥ 60%

### 9.6 Phase 1.5 验收标准 (每日复盘)

- ✅ 复盘页面 UI 美观
- ✅ 显示 3 个复盘问题
- ✅ 用户可以输入答案
- ✅ 提交后显示建议
- ✅ 显示统计数据 (完成任务数、时长、拖延次数)
- ✅ 可以查看历史记录
- ✅ 组件测试覆盖率 ≥ 60%

---

## 10. 交付清单

### 最终交付物

1. **源代码**
   - 所有组件、Store、工具函数
   - 测试文件
   - 配置文件

2. **文档**
   - 组件使用文档 (Storybook 可选)
   - API 集成指南 (如何切换 Mock → 真实 API)
   - 部署指南

3. **Demo**
   - 可运行的本地 Demo
   - 所有核心功能可演示

---

## 11. 风险与缓解

| 风险                       | 可能性 | 影响 | 缓解措施                       |
| -------------------------- | ------ | ---- | ------------------------------ |
| Mock API 与真实 API 不一致 | 中     | 高   | 严格按照 SRS API 规范编写 Mock |
| Svelte 5 Runes 不熟悉      | 高     | 中   | 参考官方文档和示例             |
| 组件复用性不足             | 中     | 中   | 提前设计组件接口               |
| 测试覆盖率不达标           | 中     | 低   | TDD 开发，先写测试             |

---

**Spec 文档结束**

_本文档将随开发进度更新，所有变更需记录版本历史。_
