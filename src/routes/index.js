import authRoutes from './auth.route.js';
import organizationRoutes from './organization.route.js';
import userRoutes from './user.route.js';

// Initialize all routes for the application.
const initialize = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/organization', organizationRoutes);
};

export default { initialize };
