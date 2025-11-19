import request from 'supertest';
import express from 'express';
import onboardingRoutes from '../src/routes/onboarding.js';
import dataStore from '../src/models/dataStore.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/onboarding-tasks', onboardingRoutes);

describe('Onboarding Tasks API', () => {
  beforeEach(() => {
    // Reset data store before each test
    dataStore.initializeData();
  });

  describe('GET /api/onboarding-tasks', () => {
    it('should return all onboarding tasks', async () => {
      const response = await request(app)
        .get('/api/onboarding-tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('status');
    });
  });

  describe('POST /api/onboarding-tasks', () => {
    it('should create a new onboarding task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test description',
        category: 'Access',
        assignee: 'Test User',
        dueDate: '2025-12-31'
      };

      const response = await request(app)
        .post('/api/onboarding-tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.category).toBe(newTask.category);
      expect(response.body.assignee).toBe(newTask.assignee);
      expect(response.body.status).toBe('Pending'); // Default status
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidTask = {
        description: 'Missing required fields'
      };

      const response = await request(app)
        .post('/api/onboarding-tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/onboarding-tasks/:id', () => {
    it('should update an existing task', async () => {
      const updates = {
        status: 'Completed'
      };

      const response = await request(app)
        .put('/api/onboarding-tasks/1')
        .send(updates)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.status).toBe('Completed');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/onboarding-tasks/9999')
        .send({ status: 'Completed' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/onboarding-tasks/:id', () => {
    it('should delete an existing task', async () => {
      await request(app)
        .delete('/api/onboarding-tasks/1')
        .expect(204);

      // Verify it's deleted
      const response = await request(app)
        .get('/api/onboarding-tasks/1')
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .delete('/api/onboarding-tasks/9999')
        .expect(404);
    });
  });
});
