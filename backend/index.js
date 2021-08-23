const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Task = require('./models/task');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

mongoose.connect(
  'mongodb://mongodb:27017/tasks',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('ERROR. Could not connect to DB !');
      console.error(err);
    } else {
      console.log('CONNECTED.');
      app.listen(5000);
    }
  }
);

app.get('/tasks', async (req, res) => {
    console.log('FETCH TASKS.');
    try {
      const tasks = await Task.find();
      res.status(200).json({
        tasks: tasks.map((task) => ({
          id: task.id,
          text: task.text,
        })),
      });
      console.log('FETCHED TASKS');
    } catch (err) {
      console.error('ERROR FETCHING TASKS');
      console.error(err.message);
      res.status(500).json({ message: 'Failed to load tasks.' });
    }
  });
  
app.post('/tasks', async (req, res) => {
  console.log('STORE TASK');
  const taskText = req.body.text;

  if (!taskText || taskText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid task.' });
  }

  const task = new Task({
    text: taskText,
  });

  try {
    await task.save();
    res
      .status(201)
      .json({ message: 'Task saved', task: { id: task.id, text: taskText } });
    console.log('STORED NEW TASK');
  } catch (err) {
    console.error('ERROR FETCHING TASKS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save task.' });
  }
});
