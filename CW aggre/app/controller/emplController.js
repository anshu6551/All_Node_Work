const Employee = require('../model/empModel');

class EmpController{

async createEmp(req,res){
 try{
  const employee = await Employee.create(req.body);
  res.status(201).json({
    success:true,
    employee
  })
 }catch(err){
    res.status(500).json({
      success:false,
      error:err.message
    })
 }
}
}



module.exports = new EmpController();

    
