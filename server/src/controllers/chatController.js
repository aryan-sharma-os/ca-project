import { body } from 'express-validator';
import Message from '../models/Message.js';

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('userJoined');
    });

    socket.on('signal', ({ roomId, data }) => {
      socket.to(roomId).emit('signal', data);
    });

    socket.on('chatMessage', async ({ roomId, appointmentId, senderId, text }) => {
      const msg = await Message.create({ appointmentId, senderId, text });
      io.to(roomId).emit('chatMessage', { _id: msg._id, text, senderId, createdAt: msg.createdAt });
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('userLeft');
    });
  });
}

export const validateSendMessage = [
  body('appointmentId').isString(),
  body('text').isString().isLength({ min: 1 })
];

export async function listMessages(req, res) {
  const { appointmentId } = req.query;
  const msgs = await Message.find({ appointmentId }).sort({ createdAt: 1 });
  res.json(msgs);
}
