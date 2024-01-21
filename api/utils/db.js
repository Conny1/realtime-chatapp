import mongoose from "mongoose";

const connect = async () => {
  await mongoose.connect(`${process.env.DB_URL}/chatApp`);

  console.log("Connected to MongoDB");
};

export default connect;
