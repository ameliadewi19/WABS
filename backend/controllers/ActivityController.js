const Activity = require('../models/ActivityModel.js');

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const newActivity = await Activity.create(req.body);
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    await activity.update(req.body);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id;

    // Check if the activity is referenced in the schedule table
    const isReferencedInSchedule = await Schedule.findOne({
      where: {
        id_activity: activityId,
      },
    });

    if (isReferencedInSchedule) {
      // If the activity is referenced, return a specific status code (e.g., 409 Conflict)
      res.status(409).json({ error: 'Activity is referenced in the schedule and cannot be deleted.' });
      return;
    }

    // If the activity is not referenced, proceed with deleting it
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    await activity.destroy();
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getActivities,
  createActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
};
