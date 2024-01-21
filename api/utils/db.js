import mongoose from "mongoose";

const connect = async () => {
  await mongoose.connect(`${process.env.DB_URL}/realtime`, {
    writeConcern: { w: "majority" },
  });

  console.log("Connected to MongoDB");
};

export default connect;
