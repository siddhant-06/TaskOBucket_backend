import authRoutes from './auth.route.js';
import organizationRoutes from './organization.route.js';
import projectRoutes from './project.route.js';
import sprintRoutes from './sprint.route.js';
import userRoutes from './user.route.js';
import issueRoutes from './issue.route.js';

// Initialize all routes for the application.
const initialize = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/organization', organizationRoutes);
  app.use('/api/project', projectRoutes);
  app.use('/api/sprint', sprintRoutes);
  app.use('/api/issue', issueRoutes);
};

export default { initialize };
