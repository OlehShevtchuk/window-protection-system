module.exports = (sequelize, DataTypes) => {
  const Sensor = sequelize.define('Sensor', {
    sensorId: DataTypes.INTEGER,
    isOpen: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    msg: DataTypes.STRING,
    status: DataTypes.STRING,
    batteryCharge: DataTypes.INTEGER,
    type: DataTypes.STRING,
    lastAlarmDate: DataTypes.DATE,
    xCoord: DataTypes.INTEGER,
    yCoord: DataTypes.INTEGER
  }, {});
  Sensor.associate = models => {
    Sensor.belongsTo(models.Window);
    Sensor.hasMany(models.Issue);
  };
  return Sensor;
};