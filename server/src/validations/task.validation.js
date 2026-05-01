const { z } = require('zod');

exports.taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  project: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Project ID'),
  assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
});

exports.updateStatusSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'completed']),
});
