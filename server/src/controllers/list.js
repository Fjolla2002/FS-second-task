import express from "express";
import List from "../models/List.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const data = await List.find({});
      if (data.length === 0) {
        return res.json({ message : "There are no lists."});
      }
      else {
        res.json(data);
      }
    } 
    catch (error) {
      res.json({error: "An error occurred while getting the lists!"});
    }
}); // get all lists
  
router.get("/:id", async (req, res) => {
    try {
      const data = await List.findById(req.params.id);
      if (!data) {
        return res.json({error: "List doesn't found!"})
      }
      else {
        res.json(data);
      }
    }
    catch (error) {
      res.json({error: "An error occurred while getting the list!"});
    }
}); // get a single list
  
router.post("/", async (req, res) => {
    try {
      const givenData = req.body;
  
      if(givenData.name === "") {
        return res.json({ error: "Name of the list is required!"});
      }
      else {
        const data = new List(givenData);
        const saveData = await data.save();
        res.json(saveData);
      }
    }
    catch (error) {
      res.json({error: "An error occurred while creating the list!"});
    }
  
}); // create a list
  
router.delete("/:id", async (req, res) => {
    try {
      const idOfList = req.params.id;
      const data = await List.findByIdAndDelete(idOfList);
      if(!data) {
        return res.json({ error: "List doesn't found!"});
      }
      else {
        res.json( {message: "List deleted sucessfullly!"});
      }
    }
    catch (error) {
      res.json({error: "An error occurred while deleting the list!"});
    }
}); // delete a list
  
router.post("/task", async (req, res) => {
    try {
      const idOfList = req.body.listId;
      const list = await List.findById(idOfList);
  
      if (!list) {
        return res.json({error : "List doesn't found!"});
      }
      else {
        const data = {
          title : req.body.title,
          finished: req.body.finished
        };
    
        if (data.title === ""){
          return res.json({error: "The task must have a title!"});
        }
        else {
          list.tasks.push(data);
          await list.save();
          res.json(list);
        }
      }
    }
    catch (error) {
      res.json({error: "An error occurred while creating the task in the list!"});
    }
}); // create a task in list
  
router.delete("/:listId/task/:id", async (req, res) => {
    try {
      const idOfList = req.params.listId; 
      const idOfTask = req.params.id; 
  
      const list = await List.findById(idOfList);
  
      if (!list) {
        return res.json({ error: "List not found!" });
      } else {
        const taskToDelete = list.tasks.findIndex((task) => task._id === idOfTask);
  
        if (!taskToDelete) {
          return res.json({ error: "Task not found!" });
        } 
        else {
          list.tasks.splice(taskToDelete, 1);
          await list.save();
          return res.json({ message: "Task deleted successfully!" });
        }
      }
    } catch (error) {
      return res.json({ error: "An error occurred while deleting the task in the list!" });
    }
});  // delete a task in list
  
router.put("/:listId/task/:id", async (req, res) => {
    try {
      const idOfList = req.params.listId;
      const idOfTask = req.params.id;
      const taskTitle = req.body.title;
      const taskFinished = req.body.finished;
  
      const list = await List.findById(idOfList);
  
      if (!list) {
        return res.json({error: "List doesn't found!"});
      }
      else {
        const taskData = list.tasks.find((task) => (task._id.toString() === idOfTask));
  
        if(!taskData) {
          return res.json({error: "Task not found!"});
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
  
          await list.save();
          res.json({message : "Task updated successfully!"});
        }
      }
    }
    catch (error) {
      res.json({error: "An error occurred while updating the task in the list!"})
    }
}); // update a task in list
  
export default router;
