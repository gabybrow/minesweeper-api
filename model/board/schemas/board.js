module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define(
    'board',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      rows: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      cols: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      mines: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM,
        values: ['started', 'won', 'lost'],
        defaultValue: 'started'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at'
      }
    },
    {
      timestamps: false,
      paranoid: true,
      underscored: true,
      freezeTableName: true
    }
  );

  return Board;
};