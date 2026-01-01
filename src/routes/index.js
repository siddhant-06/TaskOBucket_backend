import userRoutes from './user.routes.js';

// Initialize all routes for the application.
const initialize = (app) => {
  app.use('/api', userRoutes);
};

export default { initialize };
