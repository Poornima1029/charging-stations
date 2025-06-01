import express from 'express';
import { 
  getStations, 
  getStationById, 
  createStation, 
  updateStation, 
  deleteStation 
} from '../controllers/stationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getStations)
  .post(createStation);

router.route('/:id')
  .get(getStationById)
  .put(updateStation)
  .delete(deleteStation);

export default router;