const { Rating, Resource } = require('../models');

exports.createRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const resourceId = req.params.id || req.body.resourceId;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    const ratingRecord = await Rating.findOneAndUpdate(
      { resourceId, userId: req.user.id },
      { rating },
      { new: true, upsert: true }
    );
    
    // Recalculate averageRating
    const allRatings = await Rating.find({ resourceId });
    const avg = allRatings.reduce((acc, r) => acc + r.rating, 0) / allRatings.length;
    resource.averageRating = avg;
    await resource.save();

    res.json(ratingRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error rating resource' });
  }
};

exports.getResourceRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ resourceId: req.params.id });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching ratings' });
  }
};
