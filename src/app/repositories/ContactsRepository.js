// uuid -> Universal unique id
// ids sequenciais abrem espaço para usuários mal intencionados usarem os ids das contas anteriores
const db = require('../../database');

/*
  Objetivo: Juntar os dados do contacts com os dados da category

  DIZER DE QUE FORMA SE RELACIONAM

  JOIN categories ON id = category_id

  O JOIN é semelhante ao WHERE
  JOIN categories -> buscando na tabela de categories
  ON id = category_id -> a coluna id que corresponde ao category_id

  o id aparece tanto na tabela categories quanto na contacts
  categories.id -> para especificar a tabela

  o id e name de category acaba sobreescrevendo o id e nam de contact no momento do JOIN

  SELECT contacts.*, categories.name AS category_name
      FROM contacts
      FULL JOIN categories ON categories.id = contacts.category_id
      ORDER BY contacts.name ${direction}

  só traz os registros de contacts que tenham vínculo com categories

  LEFT -> tabela do FROM
  RIGHT -> tabela do JOIN

  EXISTEM 4 JOINS

  INNER JOIN -> PADRÃO E TRAZ OS REGISTROS DA INTERSEÇÃO, QUE POSSUEM LIGAÇÃO ENTRE ELES
  LEFT  JOIN -> TRAZ TUDO DA INTERSEÇÃO E TODOS DA COLUNA FROM(ESQUERDA)
  RIGHT JOIN -> TRAZ TUDO DA INTERSEÇÃO E TODOS DA COLUNA JOIN(DIREITA)
  FULL  JOIN -> TRAZ TUDO DA DIREITA, ESQUERDA E INTERSEÇÃO
*/

class ContactsRepository {
  // Usar nomes genéricos e simples para padronizar e facilitar o uso dos vários repositórios
  async findAll(orderBy = 'ASC') {
    // Nunca deverá haver regras de negócio aqui(ifs são indícios disso)
    // deve única e exclusivamente executar o código e nunca tratar erros
    // NUNCA USAREMOS O REJECT AQUI
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON categories.id = contacts.category_id
      ORDER BY contacts.name ${direction}

    `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      lEFT JOIN categories ON categories.id = contacts.category_id
      WHERE contacts.id = $1
    `, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, phone, category_id,
  }) {
    /*
      SQL INJECTION -> ele pode mandar SQL que será executado no nosso
      banco, podendo listar tabelas e até apaga-las
    */
    // name - ';
    // INSERT INTO contacts(name) VALUE('';') -> usuário forçando erro

    const [row] = await db.query(`
      INSERT INTO contacts(name, email, phone, category_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `, [name, email, phone, category_id]);

    return row;
  }

  async update(id, {
    name,
    email,
    phone,
    category_id,
  }) {
    const [row] = await db.query(`
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, category_id = $4
      WHERE id = $5
      RETURNING *
    `, [name, email, phone, category_id, id]);
    return row;
  }

  async delete(id) {
    const deleteOp = await db.query(`
      DELETE FROM contacts WHERE id = $1
    `, [id]);
      // sempre retorna um array vazio []
    return deleteOp;
  }
}

module.exports = new ContactsRepository();
