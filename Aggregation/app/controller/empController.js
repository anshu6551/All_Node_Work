const Employee = require('../models/empModel');

const httpStatusCode = require('../utils/httpStatusCode')

class EmpController {
    async createEmployees(req, res) {
        try {
            const employee = await Employee.create(req.body);
            res.status(201).json({
                success: true,

                data: employee
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    async getEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.status(httpStatusCode.OK).json({
                success: true,
                total: employees.length,
                data: employees
            });
        } catch (err) {
            res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: err.message
            });
        }
    }

    //Q1:Find all employees from the IT department.
    async q1(req, res) {
        try {
            // More efficient and readable for simple filtering
            const data = await Employee.find({ department: "IT" });
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


    //Q2 Display only name and salary.(CW)

    async q2(req, res) {
        try {
            const data = await Employee.aggregate([
                { $project: { _id: 0, name: 1, salary: 1 } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }   
    }




    //Q2. Find employees whose salary is greater than 50,000.(Q3CW)

    async q3c(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { salary: { $gt: 50000 } } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

//Q4. Count total employees.

    async q4c(req, res) {
        try {
            const data = await Employee.aggregate([ { $count: "totalEmployees" } ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }   
    }

    //Q5. Find employees from Kolkata.

    async q5c(req, res) {
        try {
            const data = await Employee.aggregate([ { $match: { address: { city: "Kolkata" } } } ]);
            res.status(200).json({ success: true, data });
        } catch (error) {       
            res.status(500).json({ success: false, message: error.message });
        }
    }


    //Q6.Sort employees by salary ascending.

    async q6c(req, res) {
        try {
            const data = await Employee.aggregate([{ $sort: { salary: 1 } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q7.Sort employees by salary descending.

    async q7c(req, res) {
        try {
            const data = await Employee.aggregate([{ $sort: { salary: -1 } }]);     
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }   
    }

    //Q8. Show first 3 employees.
    async q8c(req, res) {
        try {
            const data = await Employee.aggregate([{ $limit: 3 }]);     
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q9. Skip first 2 employees and show remaining.

    async q9c(req, res) {
        try {
            const data = await Employee.aggregate([{ $skip: 2 }]);      
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q10. Find employees older than 28.

    async q10c(req, res) {
        try {
            const data = await Employee.aggregate([{ $match: { age: { $gt: 28 } } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q11. Calculate total salary department-wise.

    async q11c(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalSalary: { $sum: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q12.  Find average salary department-wise


    async q12c(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        averageSalary: { $avg: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q13. Find highest salary in each department.

    async q13c(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        maxSalary: { $max: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


    //Q14. Find lowest salary in each department.

    async q14c(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        minSalary: { $min: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q3. Find active employees only.

    async q3(req, res) {
        try {
            const data = await Employee.aggregate([{ $match: { status: "Active" } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q4 Find employees whose age is between 25 and 35.

    async q4(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { age: { $gte: 25, $lte: 35 } } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q5. Find employees from Kolkata with salary above 40,000.

    async q5(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { city: "Kolkata", salary: { $gt: 40000 } } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


    //Q6. Count total employees in each department.

    async q6(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: { $sum: 1 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q7. Calculate total salary department-wise

    async q7(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalSalary: { $sum: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q8. Find average salary of each department.

    async q8(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        averageSalary: { $avg: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q9. Find maximum salary in each department.

    async q9(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        maxSalary: { $max: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q10. Find minimum salary in each department.

    async q10(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        minSalary: { $min: "$salary" },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q11. Find total employees in each city.

    async q11(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$city",
                        totalEmployees: { $sum: 1 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q12. Find departments with more than 5 employees.

    async q12(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        totalEmployees: { $gt: 5 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //$sort
    //Q13. Sort employees by salary ascending.

    async q13(req, res) {
        try {
            const data = await Employee.aggregate([{ $sort: { salary: 1 } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q14. Sort employees by salary descending.

    async q14(req, res) {
        try {
            const data = await Employee.aggregate([{ $sort: { salary: -1 } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q15. Sort employees by age descending.

    async q15(req, res) {
        try {
            const data = await Employee.aggregate([{ $sort: { age: -1 } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q16. Sort employees first by department then by salary descending.

    async q16(req, res) {
        try {
            const data = await Employee.aggregate([
                { $sort: { department: 1, salary: -1 } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //$limit
    //Q17. Get top 5 highest-paid employees.

    async q17(req, res) {
        try {
            const data = await Employee.aggregate([
                { $sort: { salary: -1 } },
                { $limit: 5 },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q18. Get first 10 employees.

    async q18(req, res) {
        try {
            const data = await Employee.aggregate([{ $limit: 10 }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q19. Get top 3 youngest employees.

    async q19(req, res) {
        try {
            const data = await Employee.aggregate([
                { $sort: { age: 1 } },
                { $limit: 3 },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //$skip
    //Q20. Skip first 5 employees and display remaining.

    async q20(req, res) {
        try {
            const data = await Employee.aggregate([{ $skip: 5 }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q21. Implement page 2 with page size 10.

    async q21(req, res) {
        try {
            const data = await Employee.aggregate([{ $skip: 10 }, { $limit: 10 }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q22. Implement page 3 with page size 20.
    
    async q22(req, res) {
        try {
            const page = Number(req.query.page) || 1;

            const limit = Number(req.query.limit) || 20;

            const skip = (page - 1) * limit;

            const data = await Employee.aggregate([
                { $skip: skip },
                { $limit: limit },
            ]);

            res.status(200).json({
                success: true,
                currentPage: page,
                limit,
                totalRecords: data.length,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    //$addFields
    //Q23. Add a field called bonus equal to 10% of salary.

    async q23(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $addFields: {
                        bonus: {
                            $multiply: ["$salary", 0.1],
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q24.Add a field called annualSalary = salary × 12.

    async q24(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $addFields: {
                        annualSalary: {
                            $multiply: ["$salary", 12],
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q25. Add a field called salaryCategory
    // Rules:
	//Above 70000 → High 
   //40000-70000 → Medium 
    //Below 40000 → Low 


    async q25(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $addFields: {
                        salaryCategory: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ["$salary", 70000] },
                                        then: "High",
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $gte: ["$salary", 40000] },
                                                { $lte: ["$salary", 70000] },
                                            ],
                                        },
                                        then: "Medium",
                                    },
                                ],
                                default: "Low",
                            },
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q26. Create full employee label:
    //John - IT Department
    //using $concat.

    async q26(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $addFields: {
                        employeeLabel: {
                            $concat: ["$name", " - ", "$department", " Department"],
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //$sample
    //Q27. Fetch 5 random employees.

    async q27(req, res) {
        try {
            const data = await Employee.aggregate([{ $sample: { size: 5 } }]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q28. Fetch 3 random employees from IT department.

    async q28(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { department: "IT" } },
                { $sample: { size: 3 } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //mixed aggregation
    //Q29. Find top 5 departments with highest average salary.
    //•	Match Active Employees 
   //Group by Department 
   //	Average Salary 
   //Sort Desc 
  //	Limit 5 

    

    async q29(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { status: "Active" } },
                {
                    $group: {
                        _id: "$department",
                        averageSalary: { $avg: "$salary" },
                    },
                },
                { $sort: { averageSalary: -1 } },
                { $limit: 5 },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

//Q30. Generate Department Report
//Requirements:
//•	Group by Department 
//•	Total Employees 
//•	Total Salary 
//•	Average Salary 
//•	Maximum Salary 
//•	Minimum Salary 
//•	Sort by Average Salary Descending 


    async q30(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: { $sum: 1 },
                        totalSalary: { $sum: "$salary" },
                        averageSalary: { $avg: "$salary" },
                        maxSalary: { $max: "$salary" },
                        minSalary: { $min: "$salary" },
                    },
                },
                { $sort: { averageSalary: -1 } },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    //bonus
    //Q31. Find second highest salary employee.

    async q31(req, res) {
        try {
            const data = await Employee.aggregate([
                { $sort: { salary: -1 } },
                { $skip: 1 },
                { $limit: 1 },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q32. Find employees who joined in the current year.

    async q32(req, res) {
        try {
            const currentYear = new Date().getFullYear();

            const data = await Employee.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{ $year: "$joiningDate" }, currentYear],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        department: 1,
                        salary: 1,
                        joiningDate: 1,
                    },
                },
            ]);

            res.status(200).json({
                success: true,
                count: data.length,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    //Q33. Find department-wise employee names in an array using $push.

    async q33(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        employees: {
                            $push: "$name",
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q34. Find city-wise average salary greater than 50,000.

    async q34(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$city",
                        averageSalary: {
                            $avg: "$salary",
                        },
                    },
                },
                {
                    $match: {
                        averageSalary: { $gt: 50000 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q35. Get top 3 departments having maximum employees.

    async q35(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: { $sum: 1 },
                    },
                },
                { $sort: { totalEmployees: -1 } },
                { $limit: 3 },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q36. Add field experienceYears from joiningDate.

    async q36(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $addFields: {
                        experienceYears: {
                            $dateDiff: {
                                startDate: "$joiningDate",
                                endDate: new Date(),
                                unit: "year",
                            },
                        },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q37. Find duplicate employee names.

    async q37(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$name",
                        count: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        count: { $gt: 1 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q38. Find departments where average salary exceeds 60,000.

    async q38(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $group: {
                        _id: "$department",
                        averageSalary: {
                            $avg: "$salary",
                        },
                    },
                },
                {
                    $match: {
                        averageSalary: { $gt: 60000 },
                    },
                },
            ]);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //Q39. Get random employee from every department.
    async q39(req, res) {
        try {
            const data = await Employee.aggregate([
                {
                    $sample: {
                        size: 30,
                    },
                },
                {
                    $group: {
                        _id: "$department",
                        employee: {
                            $first: "$$ROOT",
                        },
                    },
                },
            ]);

            res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    //Q40. Generate employee dashboard report using:
//•	$match 
//•	$group 
//•	$sort 
//•	$limit 
//•	$addFields

    async q40(req, res) {
        try {
            const data = await Employee.aggregate([
                { $match: { status: "Active" } },
                {
                    $addFields: {
                        annualSalary: {
                            $multiply: ["$salary", 12],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$department",
                        totalEmployees: { $sum: 1 },
                        averageSalary: { $avg: "$salary" },
                        totalSalary: { $sum: "$salary" },
                    },
                },
                { $sort: { averageSalary: -1 } },
                { $limit: 10 },
            ]);

            res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }


}

module.exports = new EmpController();


