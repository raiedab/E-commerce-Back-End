const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category}, {model: Tag}],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag},],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err.toString());
  }
});

// create new product
router.post('/', (req, res) => {
  const product =  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.toString());
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({
          where: { product_id: req.params.id },
        });
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        console.log(productTags)
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }
      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err.toString());
    });
});

// delete product
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProduct) => {
      res.json(deletedProduct);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
