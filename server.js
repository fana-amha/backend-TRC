require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();
    console.log('MongoDB Connected Successfully');

    // Start server ONLY after DB connects
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed ❌', error);
    process.exit(1); // stop server if DB fails
  }
};

startServer();