const Department = require('../models/department');
const { success, error } = require('../constant');

exports.manageDepartment = async (req, res) => {
    try {
        const departmentData = { name: req.body.name };

        if (!name) {
            res.status(400).json({ success: false, message: "Department name is required"});
        }

        const existingName = await Department.findOne({ name });
        if (existingName) {
            res.status(201).json({ message: "Department already exists"})
        }

        const department = new Department.create(departmentData);
        await department.save();
        return res.status(201).json({ success: true, message: success. DEPARTMENT_CREATED})
    } catch (error) {
        console.error('Error creating  department:', err);
        res.status(500).json({ success: true, message: err.message || error.SERVER_ERROR });
    }
}