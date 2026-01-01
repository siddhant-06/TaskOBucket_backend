import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/dbConfig.js';
import { sendSuccessResponse } from './src/common/response.js';
import routes from './src/routes/index.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Add security headers to responses
app.use(helmet());

// Enable CORS for all origins and allow credentials
app.use(cors({ origin: '*', credentials: true }));

// Enable Express to parse incoming JSON requests with a body size limit
app.use(
  express.json({ limit: '500mb', type: 'application/json', extended: true })
);

// Enable parsing of URL-encoded data with large limits for complex payloads
app.use(
  express.urlencoded({ parameterLimit: 100000, limit: '500mb', extended: true })
);

// Enable request logging in development format
app.use(morgan('dev'));

// Initialize and define routes
routes.initialize(app);

// Default route to check if the project is running
app.use('/', function (req, res, next) {
  return sendSuccessResponse(res, 'Project working successfully!', {}, 200);
});

// Export the Express app instance
export default app;
