const Employees = require('../models/employeeModel');
const httpStatusCode = require('../utils/httpStatusCode');



class EmpCWController {

    async createEmp(req,res){
        try{
            const employees = await Employees.create(req.body);
            res.status(httpStatusCode.CREATED).json({
                status: true,
                data: employees
            });

        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }
    }

    async getEmp(res,req){ 
        try{
            const employees = await Employees.find();
            res.status(httpStatusCode.OK).json({
                status: true,
                total: employees.length,
                data: employees
            });
        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({
                status: false,
                message: error.message
            });
        }
    }






}









module.exports = new EmpCWController();