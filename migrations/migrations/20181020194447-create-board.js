module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('board', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      rows: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8
      },
      cols: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8
      },
      mines: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      status: {
        type: Sequelize.ENUM('started', 'won', 'lost'),
        defaultValue: 'started'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('board');
  }
};
