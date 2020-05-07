const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin
  } = require("fabric-network");
  const path = require("path");
  const fs = require('fs');
  const FabricCAServices = require('fabric-ca-client');
  
  const ccpPath = path.resolve(__dirname, "..", "..","..", "connection-org1.json");
  const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(ccpJSON);
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = new FileSystemWallet(walletPath);

  exports.login = async (req, res) => {
    console.log(`Wallet path: ${walletPath}`);

       let patientId = req.params.patientId;
       console.log("patientId: ", req.params.patientId)
        try{
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        let resultMessage=null
        if (userExists) {
            console.log(`An identity for the patient ${patientId} already exists in the wallet`);
            resultMessage = `An identity for the patient ${patientId}  exists in the wallet`;
        }
        else{
            resultMessage = `An identity for the patient ${patientId}  does not exist in the wallet`;
        }

        
        res.json({
            result: "ok",
            message: resultMessage
          });
    } catch (error) {
        console.error(`Failed to get login info for patient ${patientId}: ${error}`);
        res.json({
            result: "failed",
            message: `Failed to get login info for patient ${patientId}: ${error}`
          });
        
    }
    
}

  exports.enrollAdmin = async (req, res) => {
    console.log(`Wallet path: ${walletPath}`);

   
     try{
     // Create a new CA client for interacting with the CA.
     const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
     const caTLSCACerts = caInfo.tlsCACerts.pem;
     const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

     // Create a new file system based wallet for managing identities.
     const walletPath = path.join(process.cwd(), 'wallet');
     const wallet = new FileSystemWallet(walletPath);
     console.log(`Wallet path: ${walletPath}`);

     // Check to see if we've already enrolled the admin user.
     const adminExists = await wallet.exists('admin');
     if (adminExists) {
         console.log('An identity for the admin user "admin" already exists in the wallet');
         return;
     }

     // Enroll the admin user, and import the new identity into the wallet.
     const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
     const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
     await wallet.import('admin', identity);
     console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

     res.json({
         result: "ok",
         message: 'Successfully enrolled admin user "admin" and imported it into the wallet'
       });
 } catch (error) {
     console.error(`Failed to enroll admin : ${error}`);
     res.json({
         result: "failed",
         message: `Failed to enroll admin : ${error}`
       });
     
 }

  }

exports.registerPatient = async (req, res) => {
    console.log(`Wallet path: ${walletPath}`);

       let patientId = req.body.patientId;
       console.log("patientId: ", req.body.patientId)
        try{
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (userExists) {
            console.log(`An identity for the patient ${patientId} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: patientId, role: 'client', attrs: [{ name: "role", value: "patient", ecert: true }] }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: patientId, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(patientId, userIdentity);
        console.log(`Successfully registered and enrolled  patient ${patientId} and imported it into the wallet`);
        res.json({
            result: "ok",
            message: `Successfully registered and enrolled  patient ${patientId} and imported it into the wallet`
          });
    } catch (error) {
        console.error(`Failed to register patient ${patientId}: ${error}`);
        res.json({
            result: "failed",
            message: `Failed to register patient ${patientId}: ${error}`
          });
        
    }
}

exports.registerDoctor = async (req, res) => {

    let doctorId = req.body.doctorId;
        try{
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (userExists) {
            console.log(`An identity for the doctor ${doctorId} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: doctorId, role: 'client', attrs: [{ name: "role", value: "doctor", ecert: true }] }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: doctorId, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(doctorId, userIdentity);
        console.log(`Successfully registered and enrolled doctor ${doctorId} and imported it into the wallet`);
        res.json({
            result: "ok",
            message: `Successfully registered and enrolled doctor ${doctorId} and imported it into the wallet`
          });
    } catch (error) {
        console.error(`Failed to register doctor ${doctorId}: ${error}`);
        res.json({
            result: "failed",
            message: `Failed to register doctor ${doctorId}: ${error}`
          });
        
    }
}

exports.createPatientRecord = async (req, res) => {
    let patientId = req.body.patientId;
    let name = req.body.name;
    let address = req.body.address;
    let age = req.body.age;
    let dateofbirth = req.body.dateofbirth;
    let height = req.body.height;
    let weight = req.body.weight;

    try{
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createPatientRecord',name,address,age,dateofbirth,height,weight);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            message: `Created patient record for the patient ${patientId} successfully`
          });

    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to create patient record: ${error}`
        });
    }
    
}

exports.createDoctorRecord = async (req, res) => {
    let doctorId = req.body.doctorId;
    let name = req.body.name;
    let address = req.body.address;
    let age = req.body.age;
    let specialization = req.body.specialization;
    let workexperience = req.body.workexperience;

    try{
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createDoctorRecord',name,address,age,specialization,workexperience);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            message: `Created doctor record for the doctor ${doctorId} successfully`
          });

    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to create doctor record: ${error}`
        });
    }
    
}


exports.addPermission = async (req, res) => {
    
     let patientId = req.body.patientId;
     let doctorId = req.body.doctorId;

    try{
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the user ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('addPermission',doctorId);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            message: `Added user ${doctorId} to the accesslist of ${patientId} successfully`
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to add permission: ${error}`
        });
    }
}

exports.writePatientRecord = async (req, res) => {
    let patientId = req.body.patientId;
    let doctorId = req.body.doctorId;
    let healthissue = req.body.healthissue;
    let medicine = req.body.medicine;
    let hospital = req.body.hospital;
    try{
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('writePatientRecord',patientId,healthissue,medicine,hospital);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            message: `Added patient record to the patient ${patientId} successfully`
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to add patient record: ${error}`
        });
    }
}

exports.getDoctorList = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{ 
    
    try{
        let patientId = req.params.patientId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getDoctorList');
        const JsonResult = JSON.parse(result.toString());
        const doctorlist = JsonResult.accesslist;
        console.log(`Transaction has been evaluated, result is: ${doctorlist.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: doctorlist
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get doctor list: ${error}`
        });
    }
}

}

exports.getAllowedList = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{
    
    try{
        let doctorId = req.params.doctorId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getAllowedList');
        const JsonResult = JSON.parse(result.toString());
        const allowedList = JsonResult.allowedlist;
        console.log(`Transaction has been evaluated, result is: ${allowedList.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: allowedList
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get allowed list: ${error}`
        });
    }
}

}

exports.checkMyPermissionStatus = async (req, res) => {
    
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{

    try{
        let doctorId = req.params.doctorId;
        let patientId = req.params.patientId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('checkMyPermissionStatus',patientId);
        
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: result.toString()
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get check Permission Status: ${error}`
        });
    }
}


}

exports.getMyMedicalInfo = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{
  
    
    try{

        let patientId = req.params.patientId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getMyMedicalInfo');
        
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: result.toString()
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get your Medical info: ${error}`
        });
    }
}


}

exports.getMedicalInfoByPatientId = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
 
    else{
    try{
        let patientId = req.params.patientId;
        let doctorId = req.params.doctorId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getMedicalInfoByPatientId',patientId);
        
        const JsonResult = JSON.parse(result.toString());
        const medicalinfos = JsonResult.medicalinfos;
        console.log(`Transaction has been evaluated, result is: `);
        // for(var medicalinfo in medicalinfos)
        // {
        //     console.log(medicalinfo.toString())
        // }
        var resultMedicalInfo= []

        medicalinfos.forEach(function(medicalinfo){
            console.log(medicalinfo)
            resultMedicalInfo.push(medicalinfo)
        });

        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: resultMedicalInfo
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get  Medical info of patient ${patientId}: ${error}`
        });
    }
}


}

exports.deletePermission = async (req, res) => {
    
    let patientId = req.body.patientId;
    let doctorId = req.body.doctorId;

   try{
       console.log(`Wallet path: ${walletPath}`);

       // Check to see if we've already enrolled the user.
       const userExists = await wallet.exists(patientId);
       if (!userExists) {
           console.log(`An identity for the user ${patientId} does not exist in the wallet`);
           console.log('Run the registerUser.js application before retrying');
           return;
       }

       // Create a new gateway for connecting to our peer node.
       const gateway = new Gateway();
       await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

       // Get the network (channel) our contract is deployed to.
       const network = await gateway.getNetwork('mychannel');

       // Get the contract from the network.
       const contract = network.getContract('recordscontract');

       // Submit the specified transaction.
       // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
       // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
       await contract.submitTransaction('deletePermission',doctorId);
       console.log('Transaction has been submitted');

       // Disconnect from the gateway.
       await gateway.disconnect();

       res.json({
           status: "success",
           message: `deleter doctor ${doctorId} from the accesslist of ${patientId} successfully`
         });
   }
   catch (error) {
       res.json({
         status: "failed",
         message: `Failed to delete permission: ${error}`
       });
   }
}

exports.updatePatientInfo = async (req, res) => {
    let patientId = req.body.patientId;
    let name = req.body.name;
    let address = req.body.address;
    let age = req.body.age;
    let dateofbirth = req.body.dateofbirth;
    let height = req.body.height;
    let weight = req.body.weight;

    try{
        console.log(`Wallet path: ${walletPath}`);
 
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the user ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }
 
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });
 
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
 
        // Get the contract from the network.
        const contract = network.getContract('recordscontract');
 
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('updatePatientInfo',name,address,age,dateofbirth,height,weight);
        console.log('Transaction has been submitted');
 
        // Disconnect from the gateway.
        await gateway.disconnect();
 
        res.json({
            status: "success",
            message: `updated patient info for patient ${patientId} successfully`
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to update patient info: ${error}`
        });
    }


}

exports.updateDoctorInfo = async (req, res) => {
    let doctorId = req.body.doctorId;
    let name = req.body.name;
    let address = req.body.address;
    let age = req.body.age;
    let specialization = req.body.specialization;
    let workexperience = req.body.workexperience;
    

    try{
        console.log(`Wallet path: ${walletPath}`);
 
        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }
 
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });
 
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
 
        // Get the contract from the network.
        const contract = network.getContract('recordscontract');
 
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('updateDoctorInfo',name,address,age,specialization,workexperience);
        console.log('Transaction has been submitted');
 
        // Disconnect from the gateway.
        await gateway.disconnect();
 
        res.json({
            status: "success",
            message: `updated doctor info for doctor ${doctorId} successfully`
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to update doctor info: ${error}`
        });
    }


}

exports.getDoctorInfo = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{
  
    
    try{

        let patientId = req.params.patientId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(patientId);
        if (!userExists) {
            console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getDoctorInfo');
        
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: result.toString()
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get Doctor info: ${error}`
        });
    }
}
}

exports.getDoctorProfile = async (req, res) => {
    if (!req.params) {
		res.status(404).json({
			message: "Parameters are not suppied"
        });
    }
    else{
  
    
    try{

        let doctorId = req.params.doctorId;
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(doctorId);
        if (!userExists) {
            console.log(`An identity for the doctor ${doctorId} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('recordscontract');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const result =  await contract.evaluateTransaction('getDoctorInfo');
        
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.json({
            status: "success",
            data: result.toString()
          });
    }
    catch (error) {
        res.json({
          status: "failed",
          message: `Failed to get Doctor Profile: ${error}`
        });
    }
}
}





