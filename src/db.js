import mongoose from "mongoose";
import config from "./config";

export default callback => {
  const options = {
    useMongoClient: true
  };
  mongoose.Promise = global.Promise;
  let db = mongoose.connect(config.mongoUrl, options);
  callback(db);
}
