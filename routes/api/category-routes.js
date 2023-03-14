const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedRows] = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );
    if (updatedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedRows = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
