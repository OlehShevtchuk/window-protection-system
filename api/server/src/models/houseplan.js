module.exports = (sequelize, DataTypes) => {
  const HousePlan = sequelize.define(
    'HousePlan',
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {},
  );
  return HousePlan;
};
