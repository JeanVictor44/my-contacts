const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  async index(request, response) {
    // Listar todos os registros
    // O await faz com que a função não saia da call stack até que seja resolvida
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    response.send(contacts);
  }

  async show(request, response) {
    // obter UM registro, apartir do id ou outro
    const { id } = request.params;
    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      // 404: Not Found
      return response.status(404).json({
        error: 'Contact not found',
      });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name,
      email,
      phone,
      category_id,

    } = request.body;

    if (!name) {
      return response.status(400).json({
        error: 'Name is required',
      });
    }
    const contactExist = await ContactsRepository.findByEmail(email);

    if (contactExist) {
      return response.status(400).json({
        error: 'This e-mail is already in use',
      });
    }

    const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id,
    });

    response.json(contact);
  }

  async update(request, response) {
    const { id } = request.params;

    const contactExist = await ContactsRepository.findById(id);
    if (!contactExist) {
      return response.status(404).json({
        error: 'Contact not found',
      });
    }
    const {
      name = contactExist.name,
      email = contactExist.email,
      phone = contactExist.phone,
      category_id = contactExist.category_id,
    } = request.body;

    const contactByEmail = await ContactsRepository.findByEmail(email);

    if (contactByEmail && contactByEmail.id !== id) {
      return response.status(400).json({
        error: 'This e-mail is already in use',
      });
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email,
      phone,
      category_id,
    });

    response.json(contact);
  }

  async delete(request, response) {
    // Deletar um registro
    const { id } = request.params;
    await ContactsRepository.delete(id);

    // Sucesso, sem corpo, no content;
    response.sendStatus(204);
  }
}

// Singleton
// exportando a instância
module.exports = new ContactController();
