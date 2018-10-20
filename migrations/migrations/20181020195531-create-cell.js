module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cell', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      col: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      revealed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      mined: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'board',
          key: 'id'
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cell');
  }
};
