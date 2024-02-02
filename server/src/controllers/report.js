import express from "express";
import Report from "../models/Report.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const data = await Report.find({});
      if (data.length === 0) {
        return res.json({ message : "There are no reports."});
      }
      else {
        res.json(data);
      }
    } 
    catch (error) {
      res.json({error: "An error occurred while getting the reports!"});
    }
}); // get all reports

router.get("/:id", async (req, res) => {
    try {
        const data = await Report.findById(req.params.id);
        if(!data) {
            return res.json({error: "Report doesn't found!"});
        }
        else {
            res.json(data);
        }
    } catch (error) {
        res.json({error: "An error occurred while getting the report!"});
    }
}); //get a single report

router.post("/", async (req, res) => {
    try {
        const { username, tasks } = req.body;

        const currentDate = new Date();

        if(!username || username.length === 0) {
            return res.json({error: "Username is required!"});
        }
        else {
            const data = new Report({ username, date: currentDate, tasks });
            const saveData = await data.save();
            res.json(saveData);
        }
    } catch (error) {
        res.json({error: "An error occurred while creating the report!"});
    }
}); //create a report

router.delete("/:id", async (req, res) => {
    try {
        const reportId = req.params.id;
        const data = await Report.findByIdAndDelete(reportId);
        if(!data) {
            return res.json({ error: "Report doesn't found!"});
        }
        else {
            res.json( {message: "Report deleted sucessfullly!"});
        }
    } catch (error) {
        res.json({error: "An error occurred while deleting the report!"});
    }
}); //delete a report

router.post("/task", async (req, res) => {
    try {
        const reportId = req.body.reportId;
        const report = await Report.findById(reportId);
        if (!report) {
        return res.status(404).json({ error: "Report doesn't found." });
        }
        else {
            const data = {
                title : req.body.title,
                finished: req.body.finished || false
            };
            if (!data.title || data.title.length === 0) {
                return res.json({ error: "Title of the task is required!" });
            }
            else {
                report.tasks.push(data);
                await report.save();
                res.json(report);
            }
        }

    } catch (error) {
        res.json({error: "An error occurred while creating the task in the report!"});
    }
}); //create a task in report

router.delete("/:reportId/task/:id", async (req, res) => {
    try {
      const reportId = req.params.reportId; 
      const taskId = req.params.id; 
  
      const report = await Report.findById(reportId);
  
      if (!report) {
        return res.json({ error: "Report doesn't found!" });
      } else {
        const taskToDelete = report.tasks.findIndex((task) => task._id === taskId);
  
        if (!taskToDelete) {
          return res.json({ error: "Task doesn't found!" });
        } 
        else {
          report.tasks.splice(taskToDelete, 1);
          await report.save();
          return res.json({ message: "Task deleted successfully!" });
        }
      }
    } catch (error) {
      return res.json({ error: "An error occurred while deleting the task in the report!" });
    }
});  // delete a task in report

router.put("/:reportId/task/:id", async (req, res) => {
    try {
      const reportId = req.params.reportId;
      const taskId = req.params.id;
      const taskTitle = req.body.title;
      const taskFinished = req.body.finished;
  
      const report = await Report.findById(reportId);
  
      if (!report) {
        return res.json({error: "Report doesn't found!"});
      }
      else {
        const taskData = report.tasks.find((task) => (task._id.toString() === taskId));
  
        if(!taskData) {
          return res.json({error: "Task doesn't found!"});
        }
  
        if(taskData.title === taskTitle && taskData.finished === taskFinished) {
          return res.json({message: "There is nothing to update!"})
        }
        else {
          if (taskTitle !== "") {
            taskData.title = taskTitle;
          }
          if (taskFinished !== undefined) {
            taskData.finished = taskFinished;
          }
  
          await report.save();
          res.json({message : "Task updated successfully!"});
        }
      }
    }
    catch (error) {
      res.json({error: "An error occurred while updating the task in the report!"})
    }
}); // update a task in list

export default router;