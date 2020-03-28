module.exports = (sequelize, DataTypes) => {
  const Zone = sequelize.define(
    'Zone',
    {
      name: { type: DataTypes.STRING, unique: true },
      xCoord: DataTypes.INTEGER,
      yCoord: DataTypes.INTEGER,
    },
    {},
  );
  Zone.associate = models => {
    Zone.hasMany(models.Window);
  };
  return Zone;
};
