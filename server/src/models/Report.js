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

const ReportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tasks: {
      type: [TaskSchema],
      default: [],
    },
  },
  { timestamps: true, collection: "reports" }
);

const ReportModel = mongoose.model("Report", ReportSchema);

export default ReportModel;
