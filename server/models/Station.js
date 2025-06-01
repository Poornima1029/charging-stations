import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Please add latitude'],
      },
      longitude: {
        type: Number,
        required: [true, 'Please add longitude'],
      },
      address: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    powerOutput: {
      type: Number,
      required: [true, 'Please add power output'],
      default: 50,
    },
    connectorType: {
      type: String,
      required: [true, 'Please add connector type'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model('Station', stationSchema);

export default Station;