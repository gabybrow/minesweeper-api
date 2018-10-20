module.exports = (sequelize, DataTypes) => {
  const Cell = sequelize.define(
    'cell',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      row: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      col: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      revealed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      mined: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      flag: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      boardId: {
        type: DataTypes.INTEGER,
        field: 'board_id',
        allowNull: true
      },
      adjacentMines: {
        type: DataTypes.INTEGER,
        field: 'adjacent_mines',
        allowNull: true
      }
    },
    {
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  );

  Cell.associate = models => {
    Cell.belongsTo(models.board);
  }

  return Cell;
};