const express = require('express');
const router = express.Router();
const ctrl = require('../controller/dashboardController');


router.post('/departments', ctrl.createDepartment);
router.get('/departments', ctrl.getDepartments);

router.post('/users', ctrl.createUser);
router.get('/users', ctrl.getUsers);

router.post('/projects', ctrl.createProject);
router.get('/projects', ctrl.getProjects);

router.post('/tasks', ctrl.createTask);
router.get('/tasks', ctrl.getTasks);



router.get('/q1', ctrl.getUsersWithDepartment);
router.get('/q2', ctrl.getUserCountByDepartment);
router.get('/q3', ctrl.getDeptNameWithUserCount);
router.get('/q4', ctrl.getProjectsWithDepartment);
router.get('/q5', ctrl.getTaskCountPerUser);
router.get('/q6', ctrl.getSalaryExpensePerDept);
router.get('/q7', ctrl.getActiveProjectsCountPerDept);
router.get('/q8', ctrl.getUserCompletedTasks);
router.get('/q9', ctrl.getTop3UsersTasks);
router.get('/q10', ctrl.getHoursWorkedPerProject);
router.get('/q11', ctrl.getDeptSummaryReport);
router.get('/q12', ctrl.getUsersWithNoTasks);
router.get('/q13', ctrl.getHighestSalaryDept);
router.get('/q14', ctrl.getProjectTaskMetrics);
router.get('/q15', ctrl.getMonthlyRegistrations);
router.get('/q16', ctrl.getUserTotalHoursWorked);
router.get('/q17', ctrl.getDeptsWithHighAvgSalary);
router.get('/q18', ctrl.getProjectEfficiencyReport);
router.get('/q19', ctrl.getUsersWithMultiProjects);
router.get('/q20', ctrl.getAdminDashboardStats);

module.exports = router;