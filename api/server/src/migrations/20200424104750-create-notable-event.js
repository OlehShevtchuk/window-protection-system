module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NotableEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      eventText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      eventSource: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('NotableEvents');
  },
};
