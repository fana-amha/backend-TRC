const { Resource, User, Category, Institution, ResourceAuthor } = require('../models');

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      status: 'Approved',
      visibility: 'Public'
    })
    .populate('categoryId', 'name')
    .populate('uploadedBy', 'fullName');

    // Fetch authors separately since ref is on author model
    const populatedResources = await Promise.all(resources.map(async (r) => {
      const authors = await ResourceAuthor.find({ resourceId: r._id });
      return { ...r.toObject(), authors };
    }));

    res.json(populatedResources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching resources' });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('categoryId')
      .populate('uploadedBy', 'fullName')
      .populate('institutionId');

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const authors = await ResourceAuthor.find({ resourceId: resource._id });
    const resourceObj = { ...resource.toObject(), authors };

    // Increment view count
    resource.viewCount += 1;
    await resource.save();

    res.json(resourceObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching resource' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, abstract, doi, keywords, categoryId, institutionId, fileURL, thumbnailURL, language, publicationDate, authors } = req.body;
    
    const newResource = await Resource.create({
      title,
      abstract,
      doi,
      keywords,
      categoryId,
      uploadedBy: req.user.id,
      institutionId,
      fileURL,
      thumbnailURL,
      language,
      publicationDate,
      status: 'Pending'
    });

    if (authors && Array.isArray(authors)) {
      const authorPromises = authors.map((author, index) => {
        return ResourceAuthor.create({
          resourceId: newResource._id,
          authorName: author.name,
          authorInstitution: author.institution,
          authorEmail: author.email,
          authorOrder: index + 1
        });
      });
      await Promise.all(authorPromises);
    }

    res.status(201).json({ message: 'Resource created and pending review', resourceId: newResource._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating resource' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }

    Object.assign(resource, req.body);
    await resource.save();

    res.json({ message: 'Resource updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating resource' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting resource' });
  }
};
