module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sensors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sensorId: {
        type: Sequelize.INTEGER
      },
      isOpen: {
        type: Sequelize.BOOLEAN
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      msg: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      batteryCharge: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      lastAlarmDate: {
        type: Sequelize.DATE
      },
      xCoord: {
        type: Sequelize.INTEGER
      },
      yCoord: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Sensors');
  }
};