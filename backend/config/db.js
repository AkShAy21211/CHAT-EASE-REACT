const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
    });

    console.log("mongodb connected", con.connection.host.green.bold);
  } catch (error) {
    console.log(`${error.message}`.red.bold);

    process.exit();
  }
};


module.exports = connectDb