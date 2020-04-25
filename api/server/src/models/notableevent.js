module.exports = (sequelize, DataTypes) => {
  const NotableEvent = sequelize.define(
    'NotableEvent',
    {
      UserId: DataTypes.INTEGER,
      eventText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      eventSource: { type: DataTypes.STRING, allowNull: false },
    },
    {},
  );

  return NotableEvent;
};
