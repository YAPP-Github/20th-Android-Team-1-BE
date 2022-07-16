import { QueryInterface, Op } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    const categories = [
      { categoryKeyword: '식사' },
      { categoryKeyword: '미팅' },
      { categoryKeyword: '여행' },
      { categoryKeyword: '기타' }
    ];
    await queryInterface.bulkInsert('CategoryKeyword', categories);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('CategoryKeyword', {
      categoryId: {
        [Op.gte]: 0
      }
    });
  }
};
