import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';

// Initialize all routes for the application.
const initialize = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
};

export default { initialize };
