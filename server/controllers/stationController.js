import Station from '../models/Station.js';

// @desc    Get all stations
// @route   GET /api/stations
// @access  Private
export const getStations = async (req, res) => {
  try {
    const stations = await Station.find({ user: req.user._id });
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single station
// @route   GET /api/stations/:id
// @access  Private
export const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check user ownership
    if (station.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this station' });
    }

    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a station
// @route   POST /api/stations
// @access  Private
export const createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;

    const station = await Station.create({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      user: req.user._id,
    });

    res.status(201).json(station);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a station
// @route   PUT /api/stations/:id
// @access  Private
export const updateStation = async (req, res) => {
  try {
    let station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check user ownership
    if (station.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this station' });
    }

    station = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(station);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a station
// @route   DELETE /api/stations/:id
// @access  Private
export const deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check user ownership
    if (station.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this station' });
    }

    await station.deleteOne();
    
    res.json({ message: 'Station removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};