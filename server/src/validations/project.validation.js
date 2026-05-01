const { z } = require('zod');

exports.projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['active', 'completed']).optional(),
  teamMembers: z.array(z.string()).optional(),
});
