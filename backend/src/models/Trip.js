const mongoose = require('mongoose');

// Activity sub-schema
const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    estimatedCost: { type: Number, default: 0 },
    time: { type: String, default: '' },
    category: { type: String, default: 'general' },
  },
  { _id: true }
);

// Day sub-schema
const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: String, default: '' },
    theme: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    activities: [activitySchema],
  },
  { _id: false }
);

// Budget breakdown sub-schema
const budgetBreakdownSchema = new mongoose.Schema(
  {
    flights: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  { _id: false }
);

// Hotel recommendation sub-schema
const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'mid-range' },
    rating: { type: Number, min: 0, max: 5, default: 3 },
    reason: { type: String, default: '' },
    budgetType: { type: String, default: '' },
    pricePerNight: { type: Number, default: 0 },
    location: { type: String, default: '' },
  },
  { _id: true }
);

// Packing item sub-schema
const packingItemSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    category: {
      type: String,
      default: 'other',
    },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

// Risk assessment sub-schema
const riskAssessmentSchema = new mongoose.Schema(
  {
    weatherRisk: { type: Number, min: 0, max: 100, default: 0 },
    travelDifficulty: { type: Number, min: 0, max: 100, default: 0 },
    crowdLevel: { type: Number, min: 0, max: 100, default: 0 },
    budgetRisk: { type: Number, min: 0, max: 100, default: 0 },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    explanation: { type: String, default: '' },
    travelTips: [{ type: String }],
  },
  { _id: false }
);

// Main Trip schema
const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    countryCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 day'],
      max: [30, 'Duration cannot exceed 30 days'],
    },
    budgetTier: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Budget tier is required'],
    },
    interests: [
      {
        type: String,
      },
    ],
    itinerary: [daySchema],
    estimatedBudget: budgetBreakdownSchema,
    hotels: [hotelSchema],
    packingList: [packingItemSchema],
    riskAssessment: riskAssessmentSchema,
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'generating',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for data isolation
tripSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);
