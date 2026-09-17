// Validate environment variables first before anything else runs
import './config/env.js';

import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping the Express app
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const isValidTabletId = (tabletId) => (
  typeof tabletId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(tabletId)
);

const isValidPhrasePayload = (payload) => (
  payload &&
  typeof payload.phraseId === 'string' &&
  payload.phraseId.length > 0 &&
  typeof payload.textEn === 'string' &&
  payload.textEn.length > 0 &&
  typeof payload.textHi === 'string' &&
  payload.textHi.length > 0
);

// Attach Socket.IO instance to app for reference in controllers/routes
app.set('io', io);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on('kiosk_join', (data, acknowledge) => {
    const tabletId = data?.tabletId;

    if (!isValidTabletId(tabletId)) {
      acknowledge?.({ ok: false, error: 'Invalid tablet ID' });
      return;
    }

    if (socket.data.tabletId) {
      socket.leave(socket.data.tabletId);
    }

    socket.join(tabletId);
    socket.data.tabletId = tabletId;
    console.log(`📱 Tablet joined room ${tabletId}: ${socket.id}`);
    acknowledge?.({ ok: true, tabletId });
  });

  socket.on('send_to_tablet', (data, acknowledge) => {
    const { tabletId, phrase } = data || {};

    if (!isValidTabletId(tabletId) || !isValidPhrasePayload(phrase)) {
      acknowledge?.({ ok: false, error: 'Invalid tablet or phrase payload' });
      return;
    }

    const deliveredPhrase = {
      ...phrase,
      tabletId,
      source: 'operator',
      sentAt: phrase.sentAt || new Date().toISOString(),
    };

    io.to(tabletId).emit('receive_phrase', deliveredPhrase);
    console.log(`📤 Phrase ${phrase.phraseId} sent to room ${tabletId}`);
    acknowledge?.({ ok: true, tabletId, phraseId: phrase.phraseId });
  });

  socket.on('kiosk_session_start', (data) => {
    console.log('📢 Kiosk Active Event:', data);
    io.emit('operator_kiosk_alert', {
      event: 'CITIZEN_INTERACTING',
      kioskId: data?.kioskId || 'Kiosk-01',
      department: data?.department || 'Police',
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔥 Client disconnected: ${socket.id}`);
  });
});

const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
