'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'postId', 
      {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'Posts',
            key: 'id'
          },
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Files',
      'postId'
    );
}
}

