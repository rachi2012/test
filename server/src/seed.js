require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log('Existing data cleared.');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // Create Member
    const member = await User.create({
      name: 'Member User',
      email: 'member@test.com',
      password: 'Member@123',
      role: 'member',
    });

    console.log('Users created.');

    // Create Project
    const project = await Project.create({
      title: 'Sample Project',
      description: 'This is a sample project for testing purposes.',
      createdBy: admin._id,
      teamMembers: [member._id],
    });

    console.log('Project created.');

    // Create Tasks
    await Task.create([
      {
        title: 'Task 1: Setup Environment',
        description: 'Initialize project and install dependencies.',
        project: project._id,
        assignedTo: admin._id,
        createdBy: admin._id,
        priority: 'high',
        status: 'completed',
        dueDate: new Date(),
      },
      {
        title: 'Task 2: Build Backend',
        description: 'Implement API endpoints and models.',
        project: project._id,
        assignedTo: admin._id,
        createdBy: admin._id,
        priority: 'medium',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
      },
      {
        title: 'Task 3: Implement Frontend',
        description: 'Build the React application with Tailwind CSS.',
        project: project._id,
        assignedTo: member._id,
        createdBy: admin._id,
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
      },
      {
        title: 'Task 4: Overdue Task Test',
        description: 'This task should appear as overdue.',
        project: project._id,
        assignedTo: member._id,
        createdBy: admin._id,
        priority: 'low',
        status: 'todo',
        dueDate: new Date(Date.now() - 86400000), // Yesterday
      },
    ]);

    console.log('Tasks created.');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
