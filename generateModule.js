#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let moduleName = process.argv[2];

// Validation
if (!moduleName) {
  console.error(
    '❌ Please provide a module name. Example: npm run generate:module user'
  );
  process.exit(1);
}
moduleName = moduleName.trim().toLowerCase();

const isValidModuleName = /^[a-zA-Z0-9]+$/.test(moduleName);
if (!isValidModuleName || moduleName.split(' ').length > 1) {
  console.error(
    '❌ Invalid module name. Use a single word without spaces or special characters. Example: user'
  );
  process.exit(1);
}

const capitalized = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

// Paths
const basePath = path.join(__dirname, 'src');
const paths = {
  model: path.join(basePath, 'models', `${moduleName}.model.js`),
  service: path.join(basePath, 'services', `${moduleName}.service.js`),
  controller: path.join(basePath, 'controller', `${moduleName}.controller.js`),
  route: path.join(basePath, 'routes', `${moduleName}.routes.js`),
  config: path.join(basePath, 'config', `${moduleName}Routes.config.js`),
  validation: path.join(basePath, 'validation', `${moduleName}.validation.js`),
  test: path.join(__dirname, 'test', `${moduleName}.test.js`),
};

// Ensure no overwrite
if (fs.existsSync(paths.model)) {
  console.error(`❌ Module "${moduleName}" already exists.`);
  process.exit(1);
}

// Create directories if needed
Object.values(paths).forEach((file) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Model
fs.writeFileSync(
  paths.model,
  `
import mongoose from 'mongoose';

const ${moduleName}Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('${moduleName}', ${moduleName}Schema);
`
);

// Service
fs.writeFileSync(
  paths.service,
  `
import ${moduleName}Schema from '../models/${moduleName}.model.js';

export const create${capitalized}Service = async (data) => await ${moduleName}Schema.create(data);
export const getAll${capitalized}Service = async () => await ${moduleName}Schema.find();
export const getById${capitalized}Service = async (id) => await ${moduleName}Schema.findById(id);
export const update${capitalized}Service = async (id, data) => await ${moduleName}Schema.findByIdAndUpdate(id, data, { new: true });
export const delete${capitalized}Service = async (id) => await ${moduleName}Schema.findByIdAndDelete(id);
`
);

// Controller
fs.writeFileSync(
  paths.controller,
  `
import * as Service from '../services/${moduleName}.service.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';

export const create${capitalized}Controller = async (req, res) => {
  try {
    const data = await Service.create${capitalized}Service(req.body);
    return sendSuccessResponse(res, '${capitalized} created', data);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }
};

export const get${capitalized}Controller = async (req, res) => {
  try {
    const data = await Service.getAll${capitalized}Service();
    return sendSuccessResponse(res, '${capitalized} list fetched', data);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }
};

export const getById${capitalized}Controller = async (req, res) => {
  try {
    const data = await Service.getById${capitalized}Service(req.query.id);
    return sendSuccessResponse(res, '${capitalized} found', data);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }
};

export const update${capitalized}Controller = async (req, res) => {
  try {
    const data = await Service.update${capitalized}Service(req.query.id, req.body);
    return sendSuccessResponse(res, '${capitalized} updated', data);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }
};

export const delete${capitalized}Controller = async (req, res) => {
  try {
    const data = await Service.delete${capitalized}Service(req.query.id);
    return sendSuccessResponse(res, '${capitalized} deleted', data);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }
};
`
);

// Route
fs.writeFileSync(
  paths.route,
  `
import express from 'express';
import * as controller from '../controller/${moduleName}.controller.js';
import { payloadValidate } from '../middleware/validatorMiddleware.js';
import { create${capitalized}Validation, update${capitalized}Validation } from '../validation/${moduleName}.validation.js';
import routes from '../config/${moduleName}Routes.config.js';
import { authGaurd } from '../middleware/authGaurd.js';

const ${moduleName}Routes = express.Router();

${moduleName}Routes.post(routes.create, payloadValidate(create${capitalized}Validation), controller.create${capitalized}Controller);
${moduleName}Routes.get(routes.getAll, authGaurd, controller.get${capitalized}Controller);
${moduleName}Routes.get(routes.getById, authGaurd, controller.getById${capitalized}Controller);
${moduleName}Routes.put(routes.update, authGaurd, payloadValidate(update${capitalized}Validation), controller.update${capitalized}Controller);
${moduleName}Routes.delete(routes.delete, authGaurd, controller.delete${capitalized}Controller);

export default ${moduleName}Routes;
`
);

// Config
fs.writeFileSync(
  paths.config,
  `
const ${moduleName}Routes = {
  create: '/create',
  getById: '/getById',
  getAll: '/getAll',
  update: '/update',
  delete: '/delete'
};
export default ${moduleName}Routes;
`
);

// Validation
fs.writeFileSync(
  paths.validation,
  `
import Joi from 'joi';

export const create${capitalized}Validation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});

export const update${capitalized}Validation = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
});
`
);

// Test
fs.writeFileSync(
  paths.test,
  `
 import { expect } from 'chai';
  import request from 'supertest';
  import app from '../app.js';
  import ${moduleName}Routes from '../src/config/${moduleName}Routes.config.js';

  describe('${capitalized} Module', () => {
    let id = null;
    let token = null;

    before((done) => {
      request(app)
        .post('/api/auth/login') // Adjust if your login route differs
        .send({ email: \`alice_${Date.now()}@example.com\`, password: 'password' }) // Use test credentials
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          token = res.body?.token;
          done();
        });
    });

    it('should create one ${moduleName}', (done) => {
      request(app)
        .post(\`/api/${moduleName}\${${moduleName}Routes.create}\`)
        .set('Authorization', \`Bearer \${token}\`)
        .send({ name: 'Test', email: 'test${Date.now()}@example.com', phone: '9999999999' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          id = res.body.result._id;
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('should fetch all ${moduleName}', (done) => {
      request(app)
        .get(\`/api/${moduleName}\${${moduleName}Routes.getAll}\`)
        .set('Authorization', \`Bearer \${token}\`)
        .expect(200, done);
    });

    it('should fetch by id', (done) => {
      request(app)
        .get(\`/api/${moduleName}\${${moduleName}Routes.getById.replace(':id', id)}\`)
        .set('Authorization', \`Bearer \${token}\`)
        .expect(200, done);
    });

    it('should delete the ${moduleName}', (done) => {
      request(app)
        .delete(\`/api/${moduleName}\${${moduleName}Routes.delete.replace(':id', id)}\`)
        .set('Authorization', \`Bearer \${token}\`)
        .expect(200, done);
    });
  });
`
);

// Update routes/index.js
const routeIndex = path.join(basePath, 'routes', 'index.js');
let routeContent = fs.readFileSync(routeIndex, 'utf-8');
if (!routeContent.includes(`${moduleName}Routes`)) {
  routeContent =
    `import ${moduleName}Routes from './${moduleName}.routes.js';\n` +
    routeContent;
  routeContent = routeContent.replace(
    'const initialize = (app) => {',
    `const initialize = (app) => {\n  app.use('/api/${moduleName}', ${moduleName}Routes);`
  );
  fs.writeFileSync(routeIndex, routeContent);
}

// Final: Insert sample record and print API info
(async () => {
  try {
    const db = await import('./src/config/dbConfig.js');
    await db.connectDB();

    const model = await import(`./src/models/${moduleName}.model.js`);
    await model.default.create({
      name: 'Sample',
      email: `sample_${Date.now()}@mail.com`,
      phone: '1234567890',
    });

    if (typeof db.disconnectDB === 'function') {
      await db.disconnectDB();
    }

    console.log(`\n✅ ${capitalized} module generated successfully!`);

    console.log(`\n📢 Available ${capitalized} APIs:`);
    console.log(`POST   /api/${moduleName}/create`);
    console.log(`GET    /api/${moduleName}/getAll`);
    console.log(`GET    /api/${moduleName}/getById?id=...`);
    console.log(`PUT    /api/${moduleName}/update?id=...`);
    console.log(`DELETE /api/${moduleName}/delete?id=...`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during module setup:', err);
    process.exit(1);
  }
})();
