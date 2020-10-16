'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'postId',
       Sequelize.STRING
     );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Files',
      'postId'
    );
  }
};

  
    
