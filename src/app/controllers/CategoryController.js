const CategoriesRespository = require('../repositories/CategoriesRespository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    const categories = await CategoriesRespository.findAll(orderBy);
    response.json(categories);
  }

  async store(request, response) {
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({ error: 'name is required' });
    }
    const category = await CategoriesRespository.create({ name });
    response.json(category);
  }
}

module.exports = new CategoryController();
