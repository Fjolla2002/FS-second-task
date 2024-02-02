import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  });
  
  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      tasks: {
        type: [TaskSchema],
        default: [],
      },
    },
    { timestamps: true, collection: "lists" }
  );
  
  const ListModel = mongoose.model("List", schema);

export default ListModel;