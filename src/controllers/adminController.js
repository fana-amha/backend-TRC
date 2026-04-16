const { Resource } = require('../models');

exports.getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: 'Pending' });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching pending resources' });
  }
};

exports.approveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    resource.status = 'Approved';
    resource.visibility = 'Public';
    await resource.save();

    res.json({ message: 'Resource approved', resource });
  } catch (error) {
    res.status(500).json({ error: 'Server error approving resource' });
  }
};

exports.rejectResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    resource.status = 'Rejected';
    await resource.save();

    res.json({ message: 'Resource rejected', resource });
  } catch (error) {
    res.status(500).json({ error: 'Server error rejecting resource' });
  }
};
