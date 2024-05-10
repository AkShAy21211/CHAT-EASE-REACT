const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mongoose.connect('mongodb+srv://achu21539:rRAJJfOXWMJNvzMj@chat-app-react.kdu0w4m.mongodb.net/?retryWrites=true&w=majority&appName=CHAT-APP-REACT', {
    });

    console.log("mongodb connected", con.connection.host.green.bold);
  } catch (error) {
    console.log(`${error.message}`.red.bold);

    process.exit();
  }
};


module.exports = connectDb