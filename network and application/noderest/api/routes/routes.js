const express = require('express');

const router = express.Router();

//const mongoose = require('mongoose');

//const Contract = require('../model/contracts');
const chaincodeMethods = require('../controllers/chaincodemethods');

router.get('/', (req,res,next) => {
    res.json({
        result: "ok",
        message: "initialized"
    })
});

router.get('/login/:patientId', chaincodeMethods.login);
router.post('/enrollAdmin', chaincodeMethods.enrollAdmin);
router.post('/registerPatient', chaincodeMethods.registerPatient);
router.post('/registerPatient', chaincodeMethods.registerPatient);
router.post('/registerDoctor', chaincodeMethods.registerDoctor);
router.post('/createPatientRecord', chaincodeMethods.createPatientRecord);
router.post('/createDoctorRecord', chaincodeMethods.createDoctorRecord);
router.post('/addPermission', chaincodeMethods.addPermission);
router.post('/writePatientRecord', chaincodeMethods.writePatientRecord);
router.get('/getAllowedList/:doctorId', chaincodeMethods.getAllowedList);
router.get('/getDoctorList/:patientId', chaincodeMethods.getDoctorList);
router.get('/checkMyPermissionStatus/:doctorId/:patientId', chaincodeMethods.checkMyPermissionStatus);
router.get('/getMyMedicalInfo/:patientId', chaincodeMethods.getMyMedicalInfo);
router.get('/getMedicalInfoByPatientId/:doctorId/:patientId', chaincodeMethods.getMedicalInfoByPatientId);
router.post('/deletePermission', chaincodeMethods.deletePermission);
router.post('/updatePatientInfo', chaincodeMethods.updatePatientInfo);
router.post('/updateDoctorInfo', chaincodeMethods.updateDoctorInfo);
router.get('/getDoctorInfo/:patientId', chaincodeMethods.getDoctorInfo);
router.get('/getDoctorProfile/:doctorId', chaincodeMethods.getDoctorProfile);





module.exports = router;