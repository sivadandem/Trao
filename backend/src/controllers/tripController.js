const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const { generateTripItinerary, regenerateDay } = require('../services/geminiService');
const { sendSuccess, sendError } = require('../utils/response');

// Validation rules
const generateTripValidation = [
  body('destination').trim().notEmpty().withMessage('Destination is required').isLength({ max: 100 }),
  body('durationDays')
    .isInt({ min: 1, max: 30 })
    .withMessage('Duration must be between 1 and 30 days'),
  body('budgetTier')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Budget tier must be low, medium, or high'),
  body('interests')
    .isArray({ min: 1 })
    .withMessage('At least one interest is required'),
  body('interests.*')
    .toLowerCase()
    .isIn(['food', 'culture', 'adventure', 'shopping', 'nature', 'nightlife', 'family', 'history'])
    .withMessage('Invalid interest'),
];

const addActivityValidation = [
  body('dayNumber').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
  body('activity').isObject().withMessage('Activity object is required'),
  body('activity.title').trim().notEmpty().withMessage('Activity title is required'),
  body('activity.estimatedCostUSD').optional().custom((val) => val === '' || !isNaN(Number(val))).withMessage('Cost must be a valid number'),
  body('activity.estimatedCost').optional().custom((val) => val === '' || !isNaN(Number(val))).withMessage('Cost must be a valid number'),
  body('activity.timeOfDay').optional().trim().isString(),
  body('activity.time').optional().trim().isString(),
  body('activity.description').optional().trim().isString(),
];

const removeActivityValidation = [
  body('dayNumber').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
  body('activityId').isMongoId().withMessage('Invalid activity ID'),
];

const editActivityValidation = [
  body('dayNumber').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
  body('activityId').isMongoId().withMessage('Invalid activity ID'),
  body('updates').isObject().withMessage('Updates object is required'),
];

const regenerateTripDayValidation = [
  body('dayNumber').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
  body('instructions').optional().trim().isString().withMessage('Instructions must be a string'),
  body('customInstructions').optional().trim().isString().withMessage('Instructions must be a string'),
];

const addPackingItemValidation = [
  body('item').trim().notEmpty().withMessage('Item name is required'),
  body('category').optional().trim().isString(),
];

const updatePackingItemValidation = [
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('completed').isBoolean().withMessage('Completed status must be a boolean'),
];

/**
 * @route   POST /api/trips/generate
 * @desc    Generate AI itinerary and save trip
 * @access  Protected
 */
const generateTrip = async (req, res, next) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;
    const userId = req.user._id;

    // Create placeholder trip
    const trip = await Trip.create({
      userId,
      destination,
      durationDays,
      budgetTier,
      interests,
      status: 'generating',
    });

    // Generate AI content
    let aiData;
    try {
      aiData = await generateTripItinerary({ destination, durationDays, budgetTier, interests });
    } catch (aiError) {
      console.error('AI Generation Error:', aiError.message);
      await Trip.findByIdAndUpdate(trip._id, { status: 'failed' });
      return sendError(res, 500, 'AI travel planner failed to generate itinerary. Please try again later.');
    }

    // Update trip with AI-generated data
    const updatedTrip = await Trip.findByIdAndUpdate(
      trip._id,
      {
        country: aiData.country || '',
        countryCode: aiData.countryCode || '',
        itinerary: aiData.itinerary || [],
        estimatedBudget: aiData.estimatedBudget || {},
        hotels: aiData.hotels || [],
        packingList: aiData.packingList || [],
        riskAssessment: aiData.riskAssessment || {},
        status: 'completed',
      },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 201, 'Trip generated successfully', { trip: updatedTrip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips
 * @desc    Get all trips for authenticated user
 * @access  Protected
 */
const getTrips = async (req, res, next) => {
  try {
    const { search, budgetTier, page = 1, limit = 10 } = req.query;

    const filter = { userId: req.user._id };

    if (search) {
      filter.destination = { $regex: search, $options: 'i' };
    }
    if (budgetTier && ['low', 'medium', 'high'].includes(budgetTier)) {
      filter.budgetTier = budgetTier;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .select('-itinerary -packingList') // Exclude large fields for list view
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Trip.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Trips retrieved successfully', {
      trips,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips/:id
 * @desc    Get single trip by ID (enforces data isolation)
 * @access  Protected
 */
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });

    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    return sendSuccess(res, 200, 'Trip retrieved successfully', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a trip (enforces data isolation)
 * @access  Protected
 */
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    return sendSuccess(res, 200, 'Trip deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/add-activity
 * @desc    Add an activity to a specific day
 * @access  Protected
 */
const addActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dayNumber, activity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      return sendError(res, 404, `Day ${dayNumber} not found in itinerary`);
    }

    // Map fields from client payload { title, description, estimatedCostUSD, timeOfDay }
    // to schema fields { title, description, estimatedCost, time }
    const costValue = activity.estimatedCostUSD !== undefined ? activity.estimatedCostUSD : activity.estimatedCost;
    const timeValue = activity.timeOfDay !== undefined ? activity.timeOfDay : activity.time;

    const formattedActivity = {
      title: activity.title,
      description: activity.description || '',
      estimatedCost: Number(costValue) || 0,
      time: timeValue || '',
      category: activity.category || 'general'
    };

    trip.itinerary[dayIndex].activities.push(formattedActivity);
    await trip.save();

    return sendSuccess(res, 200, 'Activity added successfully', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/remove-activity
 * @desc    Remove an activity from a specific day
 * @access  Protected
 */
const removeActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dayNumber, activityId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      return sendError(res, 404, `Day ${dayNumber} not found in itinerary`);
    }

    trip.itinerary[dayIndex].activities = trip.itinerary[dayIndex].activities.filter(
      (a) => a._id.toString() !== activityId
    );

    await trip.save();
    return sendSuccess(res, 200, 'Activity removed successfully', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/edit-activity
 * @desc    Edit an existing activity
 * @access  Protected
 */
const editActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dayNumber, activityId, updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex === -1) {
      return sendError(res, 404, `Day ${dayNumber} not found`);
    }

    const actIndex = trip.itinerary[dayIndex].activities.findIndex(
      (a) => a._id.toString() === activityId
    );
    if (actIndex === -1) {
      return sendError(res, 404, 'Activity not found');
    }

    Object.assign(trip.itinerary[dayIndex].activities[actIndex], updates);
    await trip.save();

    return sendSuccess(res, 200, 'Activity updated successfully', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/regenerate-day
 * @desc    Regenerate a specific day using AI
 * @access  Protected
 */
const regenerateTripDay = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dayNumber, instructions, customInstructions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    if (dayNumber < 1 || dayNumber > trip.durationDays) {
      return sendError(res, 400, `Day must be between 1 and ${trip.durationDays}`);
    }

    // Regenerate specific day via AI
    let newDay;
    try {
      newDay = await regenerateDay({
        destination: trip.destination,
        dayNumber,
        durationDays: trip.durationDays,
        budgetTier: trip.budgetTier,
        interests: trip.interests,
        itinerary: trip.itinerary,
        customInstructions: instructions || customInstructions,
      });
    } catch (aiError) {
      console.error('AI Day Regeneration Error:', aiError.message);
      return sendError(res, 500, 'AI day regeneration failed. Please try again later.');
    }

    // Replace only the specified day
    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    if (dayIndex !== -1) {
      trip.itinerary[dayIndex] = { ...newDay, day: dayNumber };
    } else {
      trip.itinerary.push({ ...newDay, day: dayNumber });
    }

    await trip.save();
    return sendSuccess(res, 200, `Day ${dayNumber} regenerated successfully`, { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/packing-list
 * @desc    Update packing list item completion status
 * @access  Protected
 */
const updatePackingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemId, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    const item = trip.packingList.id(itemId);
    if (!item) {
      return sendError(res, 404, 'Packing item not found');
    }

    item.completed = completed;
    await trip.save();

    return sendSuccess(res, 200, 'Packing item updated', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/trips/:id/packing-list
 * @desc    Add item to packing list
 * @access  Protected
 */
const addPackingItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { item, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid trip ID');
    }

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    trip.packingList.push({ item, category: category || 'other', completed: false });
    await trip.save();

    return sendSuccess(res, 200, 'Item added to packing list', { trip });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/trips/:id/packing-list/:itemId
 * @desc    Remove item from packing list
 * @access  Protected
 */
const removePackingItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const trip = await Trip.findOne({ _id: id, userId: req.user._id });
    if (!trip) {
      return sendError(res, 404, 'Trip not found');
    }

    trip.packingList = trip.packingList.filter((i) => i._id.toString() !== itemId);
    await trip.save();

    return sendSuccess(res, 200, 'Item removed from packing list', { trip });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTrip,
  getTrips,
  getTripById,
  deleteTrip,
  addActivity,
  removeActivity,
  editActivity,
  regenerateTripDay,
  updatePackingItem,
  addPackingItem,
  removePackingItem,
  generateTripValidation,
  addActivityValidation,
  removeActivityValidation,
  editActivityValidation,
  regenerateTripDayValidation,
  addPackingItemValidation,
  updatePackingItemValidation,
};
