// import { expect } from 'chai';
// import request from 'supertest';
// import app from '../app.js'; // Adjust path if needed
// import userRoutesList from '../src/config/userRoutes.config.js';

// describe('👤 User API', function () {
//   describe(`POST /api${userRoutesList.create}`, function () {
//     it('should create a user and return a success response', function (done) {
//       const payload = {
//         name: 'Alice Smith',
//         email: `alice_${Date.now()}@example.com`, // ensure unique email
//         password: 'securePassword123',
//         role: 'user',
//         dob: '1995-06-15',
//         phone: '9876543210',
//       };

//       request(app)
//         .post(`/api${userRoutesList.create}`)
//         .send(payload)
//         .expect(201)
//         .end((err, res) => {
//           if (err) return done(err);

//           expect(res.body).to.have.property('success', true);
//           expect(res.body).to.have.property('statusCode', 201);
//           expect(res.body).to.have.property('result');
//           expect(res.body?.result).to.have.property('email', payload.email);
//           done();
//         });
//     });
//   });
// });
