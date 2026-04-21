import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '7d' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

tokenSchema.index({ userId: 1 });
tokenSchema.index({ accessToken: 1 });
tokenSchema.index({ refreshToken: 1 });

const Token = mongoose.model('Token', tokenSchema);

export default Token;