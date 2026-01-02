import authRoutes from './auth.route.js';

// Initialize all routes for the application.
const initialize = (app) => {
  app.use('/api/auth', authRoutes);
};

export default { initialize };
