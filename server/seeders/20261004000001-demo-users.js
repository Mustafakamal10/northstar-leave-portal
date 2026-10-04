'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminHash = bcrypt.hashSync('Admin@123', 10);
    const empHash = bcrypt.hashSync('Employee@123', 10);
    const now = new Date();

    const users = [
      {
        id: 1,
        name: 'Emily Turner',
        email: 'emily@northstar.com',
        password: adminHash,
        role: 'admin',
        designation: 'HR Administrator',
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        name: 'Mustafa Kamal',
        email: 'mustafa@northstar.com',
        password: empHash,
        role: 'employee',
        designation: 'Senior Software Engineer',
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        name: 'Abbas Khan',
        email: 'abbas@northstar.com',
        password: empHash,
        role: 'employee',
        designation: 'Junior Developer',
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
