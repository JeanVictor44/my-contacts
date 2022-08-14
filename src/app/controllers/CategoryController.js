const CategoriesRespository = require('../repositories/CategoriesRespository');

class CategoryController {
  async index(request, response) {
    const { orderBy } = request.query;
    /* Try Catch gera uma repetição imensa de código */
    const categories = await CategoriesRespository.findAll(orderBy);
    response.json(categories);

    // Error Handler (middleware express) -> Manipulador de erros não tratados
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
