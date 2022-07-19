import sequelize from 'sequelize';
import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Promising', 'updatedAt', {
      type: sequelize.DATE,
      defaultValue: new Date()
    });
    await queryInterface.addColumn('Promising', 'createdAt', {
      type: sequelize.DATE,
      defaultValue: new Date()
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Promising', 'updatedAt');
    await queryInterface.removeColumn('Promising', 'createdAt');
  }
};
