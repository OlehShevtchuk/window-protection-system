module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define('Issue', {
    issueText: DataTypes.STRING,
    isSilence: DataTypes.BOOLEAN
  }, {});
  Issue.associate = models => {
    Issue.belongsTo(models.Sensor);
  };
  return Issue;
};