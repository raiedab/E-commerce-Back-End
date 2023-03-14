const router = require('express').Router();
const { Tag, Product } = require('../../models');

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tags' });
  }
});

// GET tag by id
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
    } else {
      res.status(200).json(tagData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get tag' });
  }
});

// CREATE a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// UPDATE a tag by id
router.put('/:id', async (req, res) => {
  try {
    const [numAffectedRows] = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (numAffectedRows === 0) {
      res.status(404).json({ message: 'No tag found with that id!' });
    } else {
      res.status(200).json({ message: 'Tag updated successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// DELETE a tag by id
router.delete('/:id', async (req, res) => {
  try {
    const numAffectedRows = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (numAffectedRows === 0) {
      res.status(404).json({ message: 'No tag found with that id!' });
    } else {
      res.status(200).json({ message: 'Tag deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

module.exports = router;
