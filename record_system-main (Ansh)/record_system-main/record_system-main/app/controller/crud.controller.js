const Record = require("../models/recordModels");


class RecordController {

    async createRecord(req, res) {
        try {
            const { heading, content, createdBy } = req.body;

            if (!heading || !content || !createdBy) {
                return res.status(400).json({
                    success: false,
                    message: "All field are required",
                });
            }

            const newdata = new Record({ heading, content, createdBy });

            const result = await newdata.save();

            if (result) {
                return res.status(201).json({
                    success: true,
                    message: "Record created successfully",
                    data: result,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async readRecord(req, res) {
        try {

            let allRecord = await Record.find({ isDeleted: false });

            return res.status(200).json({
                success: true,
                message: "All record get successfully",
                total:allRecord.length,
                data: allRecord
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async updateRecord(req, res) {
        try {

            const id = req.params.id;

            const existdata = await Record.findById(id);

            if(!existdata){
                return res.status(400).json({
                    success: false,
                    message: "Record does not exist",
                });
            }

            let updatedata = await Record.findByIdAndUpdate(id, req.body, {new : true})

            if (updatedata) {
                return res.status(201).json({
                    success: true,
                    message: "Record updated successfully",
                    data: updatedata,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async deleteRecord(req, res) {
        try {

            const id = req.params.id;

            const existdata = await Record.findById(id);

            if(!existdata){
                return res.status(400).json({
                    success: false,
                    message: "Record does not exist",
                });
            }

            await Record.findByIdAndUpdate(id, { isDeleted: true }, {new : true})

            return res.status(200).json({
                success: true,
                message: "Record deleted successfully",
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

}

module.exports = new RecordController();