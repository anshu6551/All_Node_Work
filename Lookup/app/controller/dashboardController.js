

const User = require('../model/User');
const Department = require('../model/Department');
const Project = require('../model/Project');
const Task = require('../model/Task');

// Helper wrapper to handle try-catch cleanly for aggregations
const handleAggregation = async (model, pipeline, res) => {
  try {
    const results = await model.aggregate(pipeline);
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  
  createDepartment: async (req, res) => {
    try {
      const dept = new Department(req.body);
      await dept.save();
      res.status(201).json({ success: true, message: "Department Created", data: dept });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  },

  getDepartments: async (req, res) => {
    try {
      const depts = await Department.find();
      res.status(200).json({ success: true, data: depts });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  },

  createUser: async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json({ success: true, message: "User Created", data: user });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ success: true, data: users });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  },

  createProject: async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.status(201).json({ success: true, message: "Project Created", data: project });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  },

  getProjects: async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json({ success: true, data: projects });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  },

  createTask: async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json({ success: true, message: "Task Created", data: task });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  },

  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json({ success: true, data: tasks });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  },

  
  // 1. Show all users with their department name
  getUsersWithDepartment: (req, res) => {
    handleAggregation(User, [
      { $lookup: { from: 'departments', localField: 'departmentId', foreignField: '_id', as: 'dept' } },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $project: { name: 1, email: 1, role: 1, salary: 1, departmentName: '$dept.name' } }
    ], res);
  },

  // 2. Count total users in each department
  getUserCountByDepartment: (req, res) => {
    handleAggregation(User, [{ $group: { _id: '$departmentId', totalUsers: { $sum: 1 } } }], res);
  },

  // 3. Show department name with total employee count
  getDeptNameWithUserCount: (req, res) => {
    handleAggregation(User, [
      { $group: { _id: '$departmentId', totalEmployees: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { _id: 0, departmentName: '$dept.name', totalEmployees: 1 } }
    ], res);
  },

  // 4. Show each project with its department details
  getProjectsWithDepartment: (req, res) => {
    handleAggregation(Project, [
      { $lookup: { from: 'departments', localField: 'departmentId', foreignField: '_id', as: 'department' } },
      { $unwind: '$department' }
    ], res);
  },

  // 5. Count total tasks assigned to each user
  getTaskCountPerUser: (req, res) => {
    handleAggregation(Task, [
      { $group: { _id: '$assignedTo', totalTasks: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.name', totalTasks: 1 } }
    ], res);
  },

  // 6. Show total salary expense per department
  getSalaryExpensePerDept: (req, res) => {
    handleAggregation(User, [
      { $group: { _id: '$departmentId', totalSalaryExpense: { $sum: '$salary' } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { _id: 0, departmentName: '$dept.name', totalSalaryExpense: 1 } }
    ], res);
  },

  // 7. Show department-wise total active projects count
  getActiveProjectsCountPerDept: (req, res) => {
    handleAggregation(Project, [
      { $match: { status: 'active' } },
      { $group: { _id: '$departmentId', activeProjectsCount: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { _id: 0, departmentName: '$dept.name', activeProjectsCount: 1 } }
    ], res);
  },

  // 8. Show each user with total completed tasks count
  getUserCompletedTasks: (req, res) => {
    handleAggregation(Task, [
      { $match: { status: 'completed' } },
      { $group: { _id: '$assignedTo', completedTasksCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.name', completedTasksCount: 1 } }
    ], res);
  },

  // 9. Find top 3 users with highest completed task count
  getTop3UsersTasks: (req, res) => {
    handleAggregation(Task, [
      { $match: { status: 'completed' } },
      { $group: { _id: '$assignedTo', completedTasksCount: { $sum: 1 } } },
      { $sort: { completedTasksCount: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.name', completedTasksCount: 1 } }
    ], res);
  },

  // 10. Show total hours worked per project
  getHoursWorkedPerProject: (req, res) => {
    handleAggregation(Task, [
      { $group: { _id: '$projectId', totalHours: { $sum: '$hoursWorked' } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: '$project' },
      { $project: { _id: 0, projectName: '$project.name', totalHours: 1 } }
    ], res);
  },

  // 11. Show each department with total users, projects, and budget
  getDeptSummaryReport: (req, res) => {
    handleAggregation(Department, [
      { $lookup: { from: 'users', localField: '_id', foreignField: 'departmentId', as: 'users' } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: 'departmentId', as: 'projects' } },
      {
        $project: {
          departmentName: '$name',
          totalUsers: { $size: '$users' },
          totalProjects: { $size: '$projects' },
          totalBudget: { $sum: '$projects.budget' }
        }
      }
    ], res);
  },

  // 12. Show users who have NOT been assigned any task
  getUsersWithNoTasks: (req, res) => {
    handleAggregation(User, [
      { $lookup: { from: 'tasks', localField: '_id', foreignField: 'assignedTo', as: 'userTasks' } },
      { $match: { userTasks: { $size: 0 } } },
      { $project: { name: 1, email: 1, role: 1 } }
    ], res);
  },

  // 13. Show department with highest salary expense
  getHighestSalaryDept: (req, res) => {
    handleAggregation(User, [
      { $group: { _id: '$departmentId', totalSalaryExpense: { $sum: '$salary' } } },
      { $sort: { totalSalaryExpense: -1 } },
      { $limit: 1 },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { _id: 0, departmentName: '$dept.name', totalSalaryExpense: 1 } }
    ], res);
  },

  // 14. For each project show: total tasks, completed tasks, total hours
  getProjectTaskMetrics: (req, res) => {
    handleAggregation(Task, [
      {
        $group: {
          _id: '$projectId',
          totalTasks: { $sum: 1 },
          totalCompletedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          totalHoursWorked: { $sum: '$hoursWorked' }
        }
      },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: '$project' },
      { $project: { _id: 0, projectName: '$project.name', totalTasks: 1, totalCompletedTasks: 1, totalHoursWorked: 1 } }
    ], res);
  },

  // 15. Show monthly user registration count
  getMonthlyRegistrations: (req, res) => {
    handleAggregation(User, [
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
      { $project: { month: '$_id', count: 1, _id: 0 } }
    ], res);
  },

  // 16. Show users with total hours worked across all projects
  getUserTotalHoursWorked: (req, res) => {
    handleAggregation(Task, [
      { $group: { _id: '$assignedTo', totalHours: { $sum: '$hoursWorked' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.name', totalHours: 1 } }
    ], res);
  },

  // 17. Find departments where average salary > 50,000
  getDeptsWithHighAvgSalary: (req, res) => {
    handleAggregation(User, [
      { $group: { _id: '$departmentId', avgSalary: { $avg: '$salary' } } },
      { $match: { avgSalary: { $gt: 50000 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { _id: 0, departmentName: '$dept.name', avgSalary: 1 } }
    ], res);
  },

  // 18. Show project efficiency report
  getProjectEfficiencyReport: (req, res) => {
    handleAggregation(Task, [
      { $group: { _id: '$projectId', totalHoursWorked: { $sum: '$hoursWorked' }, employees: { $addToSet: '$assignedTo' } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: '$project' },
      { $project: { _id: 0, projectName: '$project.name', budget: '$project.budget', totalHoursWorked: 1, totalEmployeesInvolved: { $size: '$employees' } } }
    ], res);
  },

  // 19. Find users who worked on more than 2 projects
  getUsersWithMultiProjects: (req, res) => {
    handleAggregation(Task, [
      { $group: { _id: '$assignedTo', uniqueProjects: { $addToSet: '$projectId' } } },
      { $project: { projectCount: { $size: '$uniqueProjects' } } },
      { $match: { projectCount: { $gt: 2 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.name', projectCount: 1 } }
    ], res);
  },

  // 20. Create Admin Dashboard Aggregation
  getAdminDashboardStats: async (req, res) => {
    try {
      const stats = await User.aggregate([
        { $facet: { totalUsers: [{ $count: 'count' }], totalSalaryExpense: [{ $group: { _id: null, total: { $sum: '$salary' } } }] } }
      ]);
      res.status(200).json({
        success: true,
        data: {
          totalUsers: stats[0].totalUsers[0]?.count || 0,
          totalDepartments: await Department.countDocuments(),
          totalActiveProjects: await Project.countDocuments({ status: 'active' }),
          totalCompletedTasks: await Task.countDocuments({ status: 'completed' }),
          totalSalaryExpense: stats[0].totalSalaryExpense[0]?.total || 0
        }
      });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  }
};