import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, '邮箱不能为空')
  .email('邮箱格式不正确')

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(1, '密码不能为空')
  .min(8, '密码至少8个字符')
  .max(50, '密码最多50个字符')

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Register form schema
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '请确认密码'),
    displayName: z.string().min(1, '请输入显示名称').max(50, '显示名称最多50个字符'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

/**
 * Task form schema
 */
export const taskSchema = z.object({
  title: z.string().min(1, '任务标题不能为空').max(200, '标题最多200个字符'),
  description: z.string().max(2000, '描述最多2000个字符').optional(),
  priority: z.enum(['high', 'medium', 'low']),
  estimateMinutes: z.coerce
    .number()
    .int()
    .min(1, '预计时长至少1分钟')
    .max(480, '预计时长最多8小时')
    .optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).max(10, '标签最多10个').optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TaskInput = z.infer<typeof taskSchema>

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns True if valid
 */
export function isValidPassword(password: string): boolean {
  return passwordSchema.safeParse(password).success
}
