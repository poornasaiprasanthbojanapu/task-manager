/**
 * @repo/shared-types
 *
 * Single source of truth for all data shapes in this monorepo.
 * Both backend (runtime validation) and frontend (type safety)
 * import from here. Never duplicate these definitions elsewhere.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// SECTION 1: Primitive schemas
// Reusable building blocks used by multiple domain schemas
// ─────────────────────────────────────────────────────────────

export const uuidSchema = z.string().uuid({
  message: 'Must be a valid UUID',
});

export const isoDateSchema = z.coerce.date();
// z.coerce.date() accepts both Date objects AND ISO strings like
// "2024-01-15T10:30:00Z" — critical for JSON deserialization where
// dates arrive as strings from HTTP responses

// ─────────────────────────────────────────────────────────────
// SECTION 2: Task domain
// ─────────────────────────────────────────────────────────────

// The priority enum — defined once, used in schema + UI
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
// TaskPriority = 'low' | 'medium' | 'high'
// TypeScript derives this union type directly from the Zod enum
// You never write the union manually — it can never drift from the schema

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

// The full Task shape — what the database stores and the API returns
export const taskSchema = z.object({
  id: uuidSchema,
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters')
    .trim(),
  description: z.string().max(1000).trim().optional(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  assignedTo: z.string().email().optional(),
});
export type Task = z.infer<typeof taskSchema>;
// Task = {
//   id: string
//   title: string
//   description?: string | undefined
//   priority: 'low' | 'medium' | 'high'
//   status: 'todo' | 'in_progress' | 'done'
//   createdAt: Date
//   updatedAt: Date
// }

// What the client sends to CREATE a task
// We use .omit() to remove server-generated fields
// The client should never send id, createdAt, updatedAt — the server sets these
export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// What the client sends to UPDATE a task
// .partial() makes every field optional — client only sends what changed
// We still omit server fields
export const updateTaskSchema = taskSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ─────────────────────────────────────────────────────────────
// SECTION 3: API response wrappers
// Every API endpoint returns one of these two shapes
// Frontend always knows what shape to expect
// ─────────────────────────────────────────────────────────────

// Generic success wrapper — works for any data shape
export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

// Structured error — every error has a code + human message
export type ApiError = {
  success: false;
  error: {
    code: string; // machine-readable: 'TASK_NOT_FOUND'
    message: string; // human-readable:   'Task with id xyz not found'
    details?: unknown; // optional: Zod validation error details
  };
};

// The union — every response is one or the other
// Frontend discriminates on response.success to narrow the type
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Paginated response — for list endpoints
export type PaginatedResponse<T> = ApiSuccess<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

// ─────────────────────────────────────────────────────────────
// SECTION 4: Query parameter schemas
// Validates and parses URL query strings for list endpoints
// ─────────────────────────────────────────────────────────────

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  // z.coerce.number() is critical here — query params are always strings
  // '?page=2' arrives as the STRING "2", coerce converts it to NUMBER 2
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
});
export type TaskQuery = z.infer<typeof taskQuerySchema>;
