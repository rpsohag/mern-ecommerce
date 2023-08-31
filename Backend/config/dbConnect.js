import mongoose from "mongoose";

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((res) => {
      console.log(`Database Name : ${res.connection.db.databaseName}`);
      console.log(`Database Port : ${res.connection.port}`);
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected.");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default dbConnect;
