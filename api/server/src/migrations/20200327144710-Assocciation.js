module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Zone hasMany Window
    await queryInterface.addColumn('Windows', 'ZoneId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Zones',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Window hasMany Sensor
    await queryInterface.addColumn('Sensors', 'WindowId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Windows',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('Sensors', 'WindowId');
    return queryInterface.removeColumn('Windows', 'ZoneId');
  },
};
