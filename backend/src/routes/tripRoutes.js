const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/tripController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(protect);

// Trip CRUD
router.get('/', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);

// AI generation
router.post('/generate', aiLimiter, generateTripValidation, validate, generateTrip);

// Itinerary editing
router.patch('/:id/add-activity', addActivityValidation, validate, addActivity);
router.patch('/:id/remove-activity', removeActivityValidation, validate, removeActivity);
router.patch('/:id/edit-activity', editActivityValidation, validate, editActivity);
router.patch('/:id/regenerate-day', aiLimiter, regenerateTripDayValidation, validate, regenerateTripDay);

// Packing list management
router.post('/:id/packing-list', addPackingItemValidation, validate, addPackingItem);
router.patch('/:id/packing-list', updatePackingItemValidation, validate, updatePackingItem);
router.delete('/:id/packing-list/:itemId', removePackingItem);

module.exports = router;
