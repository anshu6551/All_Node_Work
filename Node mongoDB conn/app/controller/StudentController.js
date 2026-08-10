const Student= require('../model/student')

class StudentController {
    async createStudent(req, res) {
        try{
            const {name,email,phone,city} = req.body

            if (!name || !email || !phone || !city){
                return res.status(400).json({
                    sucess:false,
                    message: " All fields are required"
                })
            }
            const Stu = await Student({
                name,
                email,
                phone,
                city
            }).save()

            
                return res.status(201).json({
                    success:true,
                    message:"Student created successfully",
                    data:Stu
                })
            

        }catch(error){
            return res.status(500).json({
                sucess:false,
                message:error.message
            })
        }
}

//get all students

async getStudent(req,res){
    try{
         const data = await Student.find()
         return res.status(200).json({
            sucess:true,
            message:" all student data get successfully",
            total: data.length,
            data:data
         })
        
    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}


//get  student by id

async getStudentById(req,res){{
    try{

        const id = req.params.id

        const data = await Student.findById(id)
        return res.status(200).json({
            sucess:true,
            message:" student data get successfully",
            data:data
        })

    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}

}

//update student by id

async updateStudentById(req,res){
    try{
        const id = req.params.id
        const data= await  Student.findByIdAndUpdate(id,req.body,{new:true})
        return res.status(200).json({
            sucess:true,
            message:" student data update successfully",
            data:data
        })
    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
}


//delete student by id

async deleteStudentById(req,res){
    try{
        const id = req.params.id
        const data = await Student.findByIdAndDelete(id)
        return res.status(200).json({
            success:true,
            message:" student data delete successfully",
        })
    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
    }
    
} 

}
module.exports = new StudentController()