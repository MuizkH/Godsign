import test from 'node:test';
import assert from 'node:assert';

// Set environment to test before importing the Express app to enable test routes
process.env.NODE_ENV = 'test';

const { default: app } = await import('../app.js');

let server;
let baseUrl;

const startServer = () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopServer = () => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
};

const allowedOrigin = 'http://localhost:5173';

test('GodSign Security & Merged Functionality Verification', async (t) => {
  await startServer();

  await t.test('Security Headers (Helmet) & Request IDs', async () => {
    const res = await fetch(`${baseUrl}/test-api`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('x-content-type-options'), 'Missing Content-Type-Options');
    assert.ok(res.headers.get('x-frame-options'), 'Missing Frame Protection');
    assert.ok(res.headers.get('x-request-id'), 'Missing Request Correlation ID');
  });

  await t.test('CORS Policy Access Restrictions', async () => {
    // 1. Authorized origin passes
    const resAllowed = await fetch(`${baseUrl}/test-api`, {
      headers: { Origin: allowedOrigin }
    });
    assert.strictEqual(resAllowed.status, 200);
    assert.strictEqual(resAllowed.headers.get('access-control-allow-origin'), allowedOrigin);

    // 2. Unauthorized origin blocked with 403
    const resBlocked = await fetch(`${baseUrl}/test-api`, {
      headers: { Origin: 'http://unauthorizedsite.com' }
    });
    assert.strictEqual(resBlocked.status, 403);
    const body = await resBlocked.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'FORBIDDEN');
  });

  await t.test('Input Validation & Safe Error Formatting (Zod)', async () => {
    // 1. Invalid payload rejected with 400 Bad Request
    const resInvalid = await fetch(`${baseUrl}/test-validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bad-email', password: '123' })
    });
    assert.strictEqual(resInvalid.status, 400);
    const bodyInvalid = await resInvalid.json();
    assert.strictEqual(bodyInvalid.success, false);
    assert.strictEqual(bodyInvalid.error.code, 'VALIDATION_ERROR');
    assert.ok(Array.isArray(bodyInvalid.error.details), 'Details should be array');

    const emailIssue = bodyInvalid.error.details.find(d => d.field === 'email');
    const pwdIssue = bodyInvalid.error.details.find(d => d.field === 'password');
    assert.ok(emailIssue, 'Missing email field error');
    assert.ok(pwdIssue, 'Missing password field error');
  });

  await t.test('Auth Middleware Protection (Missing Token)', async () => {
    const res = await fetch(`${baseUrl}/test-protected`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'UNAUTHORIZED');
  });

  await t.test('Teammate REST Endpoints: Services, Lessons, Progress', async () => {
    // 1. GET /api/services
    const resServices = await fetch(`${baseUrl}/api/services`);
    assert.strictEqual(resServices.status, 200);
    const services = await resServices.json();
    assert.ok(Array.isArray(services));
    assert.ok(services.length > 0);
    assert.strictEqual(services[0].id, 'serv_1');

    // 2. GET /api/lessons
    const resLessons = await fetch(`${baseUrl}/api/lessons`);
    assert.strictEqual(resLessons.status, 200);
    const lessons = await resLessons.json();
    assert.ok(Array.isArray(lessons));
    assert.strictEqual(lessons.length, 5);

    // 3. GET /api/progress
    const resProgress = await fetch(`${baseUrl}/api/progress`);
    assert.strictEqual(resProgress.status, 200);
    const progress = await resProgress.json();
    assert.strictEqual(progress.xp, 120);
    assert.strictEqual(progress.streakCount, 3);
  });

  await t.test('Teammate REST Endpoints: Feedback Submission & Validation', async () => {
    // 1. Submit feedback successfully
    const resFeedbackPost = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 4, comments: 'Good job', kioskId: 'kiosk_01', department: 'police' })
    });
    assert.strictEqual(resFeedbackPost.status, 201);
    const bodyFeedback = await resFeedbackPost.json();
    assert.ok(bodyFeedback.feedback);
    assert.strictEqual(bodyFeedback.feedback.rating, 4);

    // 2. GET /api/feedback list
    const resFeedbackGet = await fetch(`${baseUrl}/api/feedback`);
    assert.strictEqual(resFeedbackGet.status, 200);
    const feedbackList = await resFeedbackGet.json();
    assert.ok(Array.isArray(feedbackList));
    assert.strictEqual(feedbackList.length, 1);

    // 3. Feedback validation rejection (rating out of bounds)
    const resFeedbackBad = await fetch(`${baseUrl}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 10, comments: 'Too high rating' })
    });
    assert.strictEqual(resFeedbackBad.status, 400);
    const bodyBadFeedback = await resFeedbackBad.json();
    assert.strictEqual(bodyBadFeedback.success, false);
    assert.strictEqual(bodyBadFeedback.error.code, 'VALIDATION_ERROR');
  });

  await stopServer();
});
