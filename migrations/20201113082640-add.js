'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'userId', 
      {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Files',
      'userId'
    );
}
}


       
              
      