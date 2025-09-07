const mongoose = require('mongoose');

module.exports = async function connectDB(uri){
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connect error', err);
    process.exit(1);
  }
};
