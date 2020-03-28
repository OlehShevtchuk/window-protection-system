module.exports = (sequelize, DataTypes) => {
  const Window = sequelize.define('Window', {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    accidentDate: DataTypes.DATE
  }, {});
  Window.associate = models => {
    Window.belongsTo(models.Zone);
    Window.hasMany(models.Sensor);
  };
  return Window;
};