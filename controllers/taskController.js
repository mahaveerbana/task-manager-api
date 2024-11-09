const { Task } = require('../models');

exports.createTask = async (req, res) => {
  try {
    // Check if required fields are present
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and description are required',
        errorMessage: 'Missing required fields',
        data: null
      });
    }

    // Create the task
    const task = await Task.create({ ...req.body, UserId: req.user.id });

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      errorMessage: null,
      data: task
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Task creation failed. Please try again later.',
      errorMessage: error.message,
      data: null
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { UserId: req.user.id } });

    // If no tasks are found, return a 404 response
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No tasks found',
        errorMessage: null,
        data: null
      });
    }

    res.json({
      status: 'success',
      message: 'Tasks fetched successfully',
      errorMessage: null,
      data: tasks
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Fetching tasks failed. Please try again later.',
      errorMessage: error.message,
      data: null
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Validate if the task exists
    const task = await Task.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
        errorMessage: 'Task with the provided ID not found',
        data: null
      });
    }

    // Proceed with the update
    await Task.update(req.body, { where: { id: req.params.id, UserId: req.user.id } });

    res.json({
      status: 'success',
      message: 'Task updated successfully',
      errorMessage: null,
      data: null
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Updating task failed. Please try again later.',
      errorMessage: error.message,
      data: null
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // Validate if the task exists before trying to delete
    const task = await Task.findOne({ where: { id: req.params.id, UserId: req.user.id } });
    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
        errorMessage: 'Task with the provided ID not found',
        data: null
      });
    }

    // Proceed with task deletion
    await Task.destroy({ where: { id: req.params.id, UserId: req.user.id } });

    res.json({
      status: 'success',
      message: 'Task deleted successfully',
      errorMessage: null,
      data: null
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Deleting task failed. Please try again later.',
      errorMessage: error.message,
      data: null
    });
  }
};
