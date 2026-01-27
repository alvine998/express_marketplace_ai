const app = require("./src/app");
const sequelize = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    // Sync models
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log("Database synced...");

    // Seed default roles and permissions
    const seedPermissions = require("./src/utils/seedPermissions");
    await seedPermissions();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`,
      );
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
