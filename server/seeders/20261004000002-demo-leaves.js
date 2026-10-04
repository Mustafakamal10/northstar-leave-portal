'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const leaves = [
      {
        id: 1,
        user_id: 3, // Abbas Khan
        leave_type: 'sick',
        start_date: formatDate(tomorrow),
        end_date: formatDate(dayAfterTomorrow),
        total_days: 2,
        reason: 'Suffering from severe seasonal flu and fever, physician advised 2 days rest.',
        status: 'pending',
        reviewed_by: null,
        admin_comment: null,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkInsert('leave_requests', leaves, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('leave_requests', null, {});
  }
};
