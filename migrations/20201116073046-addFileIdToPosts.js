'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Posts',
      'fileId', 
      {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'Files',
            key: 'id'
          },
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Posts',
      'fileId'
    );
}
}

