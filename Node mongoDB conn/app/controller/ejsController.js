const Student = require('../model/student');

class EjsController {

    // All students list
    async listStudent(req, res) {
        try {
            const data = await Student.find();

            res.render('studentlist', {
                title: 'Student List',
                data
            });

        } catch (error) {
            console.log(error);
        }
    }

    // Show add student form
    async addStudentForm(req, res) {
        res.render('addStudent', {
            title: "Add Student"
        });
    }

    // Add new student
    async createStudent(req, res) {
        try {
            const { name, email, phone, city } = req.body;

            await new Student({
                name,
                email,
                phone,
                city
            }).save();

            res.redirect('/studentlist');

        } catch (error) {
            console.log(error);
        }
    }

    // Show edit student form
    async editStudentForm(req, res) {
        try {
            const data = await Student.findById(req.params.id);

            res.render('editStudent', {
                title: "Edit Student",
                data
            });

        } catch (error) {
            console.log(error);
        }
    }

    // Update student
    async updateStudent(req, res) {
        try {
            await Student.findByIdAndUpdate(req.params.id, req.body);

            res.redirect('/studentlist');

        } catch (error) {
            console.log(error);
        }
    }

    // Delete student
    async deleteStudent(req, res) {
        try {
            await Student.findByIdAndDelete(req.params.id);

            res.redirect('/studentlist');

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new EjsController();