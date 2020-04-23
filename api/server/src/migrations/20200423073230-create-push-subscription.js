module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PushSubscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      endpoint: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      p256dh: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      auth: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('PushSubscriptions');
  },
};
