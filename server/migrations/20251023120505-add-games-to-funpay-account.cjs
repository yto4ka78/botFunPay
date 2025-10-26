"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("funpay_accounts", "games", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("funpay_accounts", "games");
  },
};
