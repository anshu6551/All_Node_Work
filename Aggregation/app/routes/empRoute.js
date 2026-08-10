const express = require('express');
const router = express.Router();
const EmpController = require('../controller/empController');


router.post('/create', EmpController.createEmployees)
router.get('/get', EmpController.getEmployees)


//Ques (1-5) $match
router.get('/question1', EmpController.q1);
router.get('/question2', EmpController.q2); 

// router.get('/question3c', EmpController.q3c);
// router.get('/question4c', EmpController.q4c);
// router.get('/question5c', EmpController.q5c);
// router.get('/question6c', EmpController.q6c);
// router.get('/question7c', EmpController.q7c);
// router.get('/question8c', EmpController.q8c);
// router.get('/question9c', EmpController.q9c);
// router.get('/question10c', EmpController.q10c);
// router.get('/question11c', EmpController.q11c);
// router.get('/question12c', EmpController.q12c);
// router.get('/question13c', EmpController.q13c);
// router.get('/question14c', EmpController.q14c);
// router.get('/question15c', EmpController.q15c);
// router.get('/question16c', EmpController.q16c);

router.get('/question3', EmpController.q3);
router.get('/question4', EmpController.q4);
router.get('/question5', EmpController.q5);   

//Ques (6-12) $group
router.get('/question6', EmpController.q6);
router.get('/question7', EmpController.q7);
router.get('/question8', EmpController.q8); 
router.get('/question9', EmpController.q9);
router.get('/question10', EmpController.q10);
router.get('/question11', EmpController.q11);
router.get('/question12', EmpController.q12);

//Ques(13-16) $sort
router.get('/question13', EmpController.q13);
router.get('/question14', EmpController.q14);
router.get('/question15', EmpController.q15);
router.get('/question16', EmpController.q16);

//Ques(17-19) $limit
router.get('/question17', EmpController.q17);
router.get('/question18', EmpController.q18);
router.get('/question19', EmpController.q19);

//Ques(20-22) $skip
router.get('/question20', EmpController.q20);   
router.get('/question21', EmpController.q21);
router.get('/question22', EmpController.q22);

//Ques(23-26) $addFields
router.get('/question23', EmpController.q23);
router.get('/question24', EmpController.q24);
router.get('/question25', EmpController.q25);
router.get('/question26', EmpController.q26);   

//Ques(27-28) $sample
router.get('/question27', EmpController.q27);
router.get('/question28', EmpController.q28);

//Ques(29-30) mixed aggregation
router.get('/question29', EmpController.q29);
router.get('/question30', EmpController.q30);

//Ques(31-40) bonus
router.get('/question31', EmpController.q31);
router.get('/question32', EmpController.q32);   
router.get('/question33', EmpController.q33);
router.get('/question34', EmpController.q34);
router.get('/question35', EmpController.q35);
router.get('/question36', EmpController.q36);
router.get('/question37', EmpController.q37);
router.get('/question38', EmpController.q38);
router.get('/question39', EmpController.q39);
router.get('/question40', EmpController.q40);







module.exports = router;