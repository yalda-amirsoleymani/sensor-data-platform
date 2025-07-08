const bcrypt = require('bcrypt');

const users = [
  {
    id: 1,
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
    role: 'admin',
  }
];

module.exports = users;

