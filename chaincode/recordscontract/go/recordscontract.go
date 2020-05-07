package main

import (
    
    "encoding/json"
    "fmt"
    "time"
   
    "github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
    "github.com/hyperledger/fabric/core/chaincode/shim"
    sc "github.com/hyperledger/fabric/protos/peer"
)

type RecordsContract struct {

}

type PatientRecord struct {
    PatientId       string        `json:"patientid"`
    Name            string        `json:"name"`
    Address         string        `json:"address"`
    Age             string        `json:"age"`
    DateOfBirth     string        `json:"dateofbirth"`
    Height          string        `json:"height"`
    Weight          string        `json:"weight"`
    AccessList     []string       `json:"accesslist"`
    MedicalInfos   []MedicalInfo  `json:"medicalinfos"`
}

type DoctorRecord struct{
    DocterId        string         `json:"doctorid"`
    Name            string         `json:"name"`
    Address         string         `json:"address"`
    Age             string         `json:"age"`
    Specialization  string         `json:"specialization"`
    WorkExperience  string         `json:"workexperience"`
    AllowedList     []string       `json:"allowedlist"`
}



type MedicalInfo struct{
    Date            string          `json:"date"`
    DocterId        string          `json:"docterid"`
    Hospital        string          `json:"hospital"`
    HealthIssue     string          `json:"healthissue"`
    Medicine        string          `json:"medicine"`
}

var logger = shim.NewLogger("recordscontract")

func (s *RecordsContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
    //fmt.Println(" Init")
    logger.Info("Init executed")
    return shim.Success(nil)
}

func (s *RecordsContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "createPatientRecord" {
		return s.createPatientRecord(APIstub, args)
	} else if function == "createDoctorRecord" {
		return s.createDoctorRecord(APIstub, args)
	} else if function == "writePatientRecord" {
		return s.writePatientRecord(APIstub, args)
	} else if function == "getMyMedicalInfo" {
		return s.getMyMedicalInfo(APIstub)
	} else if function == "getMedicalInfoByPatientId" {
		return s.getMedicalInfoByPatientId(APIstub, args)	
	} else if function == "getDoctorList" {
		return s.getDoctorList(APIstub)
	} else if function == "getAllowedList" {
		return s.getAllowedList(APIstub)
	} else if function == "checkMyPermissionStatus" {
		return s.checkMyPermissionStatus(APIstub, args)	
	} else if function == "addPermission" {
		return s.addPermission(APIstub, args)
	} else if function == "deletePermission" {
		return s.deletePermission(APIstub, args)
	} else if function == "updatePatientInfo" {
		return s.updatePatientInfo(APIstub, args)
	} else if function == "updateDoctorInfo" {
		return s.updateDoctorInfo(APIstub, args)
	} else if function == "getDoctorInfo" {
        return s.getDoctorInfo(APIstub)
    }

	return shim.Error("Invalid Smart Contract function name.")
}

// args
// args[0] = Name
// args[1] = Address
// args[2] = Age
// args[3] = DateOfBirth
// args[4] = Height
// args[5] = Weight
func (s *RecordsContract) createPatientRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
    
    //fmt.Println("inside createPatientRecord")
    logger.Info("inside createPatientRecord")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // Check GetAttributeValue
    role, rolefound,err := cid.GetAttributeValue(APIstub,"role")
    if err != nil {
        logger.Error("unable to get attribute role")
        return shim.Error(err.Error())
	}
	
    //fmt.Println("role found", rolefound)
    //fmt.Println("role is", role)
    logger.Debug("role found", rolefound)
    logger.Debug("role is", role)

    // Check AssertAttributeValue
    roleError := cid.AssertAttributeValue(APIstub, "role", "patient")
    if roleError != nil{
        return shim.Error("only patient can create record")
    }
  
     accesslist := []string {}
     
     medicalinfos := []MedicalInfo {}
    //var medicalinfo = MedicalInfo {}
    //var patientrecord = PatientRecord{UserId:args[0], AccessList:accesslist, AllowedList:allowedlist, MedicalInfo:medicalinfo}
    var patientrecord = PatientRecord{PatientId:id, Name:args[0], Address:args[1], Age:args[2], DateOfBirth:args[3], Height:args[4], Weight:args[5], AccessList:accesslist,  MedicalInfos:medicalinfos}
    recordAsBytes, _ := json.Marshal(patientrecord)
    APIstub.PutState(id, recordAsBytes)
    logger.Info(`Suceesfully created patient ${id} record`)

    return shim.Success(nil)

}

// args
// args[0] = Name
// args[1] = Address
// args[2] = Age
// args[3] = Specialization
// args[5] = WorkExperience

func (s *RecordsContract) createDoctorRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
    //fmt.Println("inside createDoctorRecord")
    logger.Info("inside createDoctorRecord")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // Check GetAttributeValue
    role, rolefound,err := cid.GetAttributeValue(APIstub,"role")
    if err != nil {
        logger.Error("unable to get attribute role")
        return shim.Error(err.Error())
	}
	
 
	//fmt.Println("role found", rolefound)
    //fmt.Println("role is", role)
    logger.Debug("role found", rolefound)
	logger.Debug("role is", role)
    // Check AssertAttributeValue
    roleError := cid.AssertAttributeValue(APIstub, "role", "doctor")
    if roleError != nil{
        logger.Error("attribute assert failed")
        return shim.Error("only doctor can create record")
    }
  
    
      allowedlist := []string {}
    // var doctorrecord = DoctorRecord{UserId:args[0], AllowedList:allowedlist}
    var doctorrecord = DoctorRecord{DocterId:id, Name:args[0], Address:args[1], Age:args[2], Specialization:args[3], WorkExperience:args[4], AllowedList:allowedlist}

    recordAsBytes, _ := json.Marshal(doctorrecord)
    APIstub.PutState(id, recordAsBytes)
    logger.Info(`Suceesfully created doctor ${id} record`)

    return shim.Success(nil)

}

// args
// args[0] = patientid
// args[1] = Healthissue
// args[2] = Medicine
// args[3] = Hospital

func (s *RecordsContract) writePatientRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    
    //fmt.Println("inside writePatientRecord")
    logger.Info("inside writePatientRecord")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }
    
    // Check GetAttributeValue
    role, rolefound,err := cid.GetAttributeValue(APIstub,"role")
    if err != nil {
        logger.Error("unable to get attribute value")
        return shim.Error(err.Error())
	}

	//fmt.Println("role found", rolefound)
    //fmt.Println("role is", role)
    logger.Debug("role found", rolefound)
	logger.Debug("role is", role)

    // Check AssertAttributeValue
    roleError := cid.AssertAttributeValue(APIstub, "role", "doctor")
    if roleError != nil{
        logger.Error("attribute assert failed")
        return shim.Error("only doctor can create record")
    }

     recordAsBytes, _  := APIstub.GetState(args[0])

    var patientrecord = PatientRecord{}
    json.Unmarshal(recordAsBytes, &patientrecord)
    
     isPresent :=contains(patientrecord.AccessList, id)

    if !isPresent {
        logger.Error(`${id} not present in access list of ${args[0]}`)
       return shim.Error(`${id} is not allowed to modify the record`)
    }
    //var patientMedicalInfo = patientrecord.MedicalInfos
    //fmt.Println("patientMedicalInfos: ", patientMedicalInfo)
    
    // Write Record
    // MM-DD-YYYY hh:mm:ss
    // yourbasic.org/golang/format-parse-string-time-date-example
    date := time.Now().Format("02-01-2006 15:04:05")
    
    var newMedicalInfoItem = MedicalInfo {Date:date, DocterId: id, Hospital: args[3], HealthIssue:args[1], Medicine: args[2]}
    //patientMedicalInfo = append(patientMedicalInfo, newMedicalInfoItem)
    patientrecord.MedicalInfos = append(patientrecord.MedicalInfos, newMedicalInfoItem)
	//patientrecord.MedicalInfos = patientMedicalInfo
	
    patientrecordAsBytes, _ := json.Marshal(patientrecord)
    APIstub.PutState(args[0], patientrecordAsBytes)
    logger.Info(`Suceesfully added patient ${args[0]} medical record`)

    return shim.Success(nil)

}

func contains(arr []string, str string) bool {
    for _, a := range arr{
        if a == str {
            return true
        }
    }
    return false
}

func (s *RecordsContract) getMyMedicalInfo(APIstub shim.ChaincodeStubInterface) sc.Response {
    //fmt.Println("inside getMyMedicalInfo")
    logger.Info("inside getMyMedicalInfo")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }
  
    // Get record
     recordAsBytes, _  := APIstub.GetState(id)
    var patientrecord = PatientRecord{}
    json.Unmarshal(recordAsBytes, &patientrecord)
	 
	fmt.Println("patientrecord: ", patientrecord)
    //var patientMedicalInfo = patientrecord.MedicalInfos
    logger.Info(`Suceesfully retrieved patient ${id} medical info`)


    return shim.Success(recordAsBytes)


}

// args
// args[0] = patientid

func (s *RecordsContract) getMedicalInfoByPatientId(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //fmt.Println("inside getMedicalInfoByPatientId")
    logger.Info("inside getMedicalInfoByPatientId")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get record
     recordAsBytes, _  := APIstub.GetState(args[0])
    var patientrecord = PatientRecord{}
    json.Unmarshal(recordAsBytes, &patientrecord)
    
     isPresent :=contains(patientrecord.AccessList, id)

    if !isPresent {
        logger.Error(`${id} not present in access list of ${args[0]}`)
        return shim.Error(`${id} is not allowed to read and modify the record`)
    }
    fmt.Println("patientrecord: ", patientrecord)
    logger.Info(`Suceesfully retrieved patient ${args[0]} medical info by patientid`)

    //var patientMedicalInfo = patientrecord.MedicalInfos
    return shim.Success(recordAsBytes)

//    return shim.Success(bytes[](success))

}

func (s *RecordsContract) getDoctorList(APIstub shim.ChaincodeStubInterface) sc.Response {
    //fmt.Println("inside getDoctorList")
    logger.Info("inside getDoctorList")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // Check GetAttributeValue
    role, rolefound,err := cid.GetAttributeValue(APIstub,"role")
    if err != nil {
        logger.Error("unable to get attribute role")
        return shim.Error(err.Error())
	}
	
	//fmt.Println("role found", rolefound)
    //fmt.Println("role is", role)
    logger.Debug("role found", rolefound)
	logger.Debug("role is", role)

    // Check AssertAttributeValue
    roleError := cid.AssertAttributeValue(APIstub, "role", "patient")
    if roleError != nil{
        logger.Error("assert attribute failed")
        return shim.Error("only patient can get the doctor list")
    }
    
    // get record
     recordAsBytes, _  := APIstub.GetState(id)
    var patientrecord = PatientRecord{}
    json.Unmarshal(recordAsBytes, &patientrecord)
    
    // get doctors
    //var doctors = patientrecord.AccessList
    //fmt.Println("patientrecord: ", patientrecord)
    logger.Info(`Suceesfully retrieved patient ${id} doctor list`)
    return shim.Success(recordAsBytes)

}

func (s *RecordsContract) getAllowedList(APIstub shim.ChaincodeStubInterface) sc.Response {
    //fmt.Println("inside getAllowedList")
    logger.Info("inside getAllowedList")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get record
     recordAsBytes, _  := APIstub.GetState(id)
    var doctorrecord = DoctorRecord{}
    json.Unmarshal(recordAsBytes, &doctorrecord)
    
    // get patients
    //var patients = doctorrecord.AllowedList
    //fmt.Println("doctorrecord: ", doctorrecord)
    logger.Info(`Suceesfully retrieved doctor ${id} patient list`)
    return shim.Success(recordAsBytes)

}

func (s *RecordsContract) checkMyPermissionStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    logger.Info("inside checkMyPermissionStatus")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

        // get record
         recordAsBytes, _  := APIstub.GetState(id)
        var doctorrecord = DoctorRecord{}
        json.Unmarshal(recordAsBytes, &doctorrecord)
        
         isPresent :=contains(doctorrecord.AllowedList, args[0])
    
        if !isPresent {
            logger.Warning(`${id} not present in access list of ${args[0]}`)
            return shim.Success([]byte("failed"))
        }
        
        logger.Info("`${id}  present in access list of ${args[0]}`")
		//fmt.Println("doctorrecord: ", doctorrecord)
        return shim.Success([]byte("Success"))
}

//args
//args[0] = doctorid

func (s *RecordsContract) addPermission(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //fmt.Println("inside addPermission")
    logger.Info("inside addPermission")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get patient record
     patientRecordAsBytes, _  := APIstub.GetState(id)
    var patientrecord = PatientRecord{}
    json.Unmarshal(patientRecordAsBytes, &patientrecord)
    
    // get doctor record
     doctorRecordAsBytes, _ := APIstub.GetState(args[0])
    var doctorrecord = DoctorRecord{}
    json.Unmarshal(doctorRecordAsBytes, &doctorrecord)

     isPresent :=contains(patientrecord.AccessList, args[0])
     //fmt.Println("isPresent: ",isPresent)

    // if the permission is already present then throw error that permission is  present
    if isPresent {
        logger.Error(`doctor ${args[0]} permission already present for patient ${id}`)
        return shim.Error("Doctor permission already present for the patient")
    }

     //fmt.Println("patientrecord: ",patientrecord)
    // fmt.Println("doctorrecord: ",doctorrecord)
    // var timestamp1 []string 
    // timestamp1 = append(timestamp1,time.Now())
    // timestamparray    :=  timestamp1
    

	// var accesslist []string = patientrecord.AccessList
    // fmt.Println("accesslist: ",accesslist)
    patientrecord.AccessList = append(patientrecord.AccessList, args[0])
    //accesslist = append(accesslist, args[0])
    //patientrecord.AccessList = accesslist
    patientNewRecordAsBytes, _ := json.Marshal(patientrecord)
    APIstub.PutState(id, patientNewRecordAsBytes)

    // add patient permission for doctor
	// var allowedlist []string= doctorrecord.AllowedList
    // fmt.Println("allowedlist: ",allowedlist)
    doctorrecord.AllowedList = append(doctorrecord.AllowedList, id)
    // allowedlist = append(allowedlist, id)
    // doctorrecord.AllowedList = allowedlist
    doctorNewRecordAsBytes, _ := json.Marshal(doctorrecord)
    APIstub.PutState(args[0], doctorNewRecordAsBytes)
    logger.Info(`Successfully added permission ${args[0]} to patient ${id}`)
    return shim.Success(nil)

}

func (s *RecordsContract) deletePermission(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //fmt.Println("inside  deletePermission")
    logger.Info("inside deletePermission")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get patient record
     patientRecordAsBytes, _  := APIstub.GetState(id)
    var patientrecord = PatientRecord{}
    json.Unmarshal(patientRecordAsBytes, &patientrecord)

    // get doctor record
     doctorRecordAsBytes, _ := APIstub.GetState(args[0])
    var doctorrecord = DoctorRecord{}
    json.Unmarshal(doctorRecordAsBytes, &doctorrecord)

     isPresent :=contains(patientrecord.AccessList, args[0])
     //fmt.Println("isPresent: ",isPresent)
    // if the permission is not present then throw error that permission is not present
    if !isPresent {
        logger.Error(`doctor ${args[0]} permission not present for patient ${id}`)
        return shim.Error("Doctor permission not present for the patient")
    }

    // else delete the permission
    var accesslist = patientrecord.AccessList

    var index int
    
    // get index of doctor
    for i,v := range accesslist{
        if v == args[0]{
            index = i
            break
        }

    }
     
    // remove doctor

    accesslist[index] =accesslist[len(accesslist)-1]
    accesslist[len(accesslist)-1]=""
    accesslist = accesslist[:len(accesslist)-1]
    
    // update the patient record
    patientrecord.AccessList = accesslist
    patientNewRecordAsBytes, _ := json.Marshal(patientrecord)
    APIstub.PutState(id, patientNewRecordAsBytes)


    var allowedlist = doctorrecord.AllowedList
    
    // get index of patient
    for i,v := range allowedlist{
        if v == id{
            index = i
            break
        }

    }
     
    // remove patient

    allowedlist[index] =allowedlist[len(allowedlist)-1]
    allowedlist[len(allowedlist)-1]=""
    allowedlist = allowedlist[:len(allowedlist)-1]
    
    // update the doctor record
    doctorrecord.AllowedList = allowedlist
    doctorNewRecordAsBytes, _ := json.Marshal(doctorrecord)
    APIstub.PutState(args[0], doctorNewRecordAsBytes)
    logger.Info(`Successfully deleted permission ${args[0]} for patient ${id}`)
    return shim.Success([]byte("Success"))
}

func (s *RecordsContract) updatePatientInfo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //fmt.Println("inside  updatePatientInfo")
    logger.Info("inside updatePatientInfo")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get patient record
     patientRecordAsBytes, _  := APIstub.GetState(id)
    var patientrecord = PatientRecord{}
    json.Unmarshal(patientRecordAsBytes, &patientrecord)
    
    // updating the fields
    patientrecord.Name = args[0]
    patientrecord.Address = args[1]
    patientrecord.Age = args[2]
    patientrecord.DateOfBirth = args[3]
    patientrecord.Height = args[4]
    patientrecord.Weight = args[5]

    // updating the record
    newPatientRecordAsBytes, _ := json.Marshal(patientrecord)
    APIstub.PutState(id, newPatientRecordAsBytes)
    logger.Info(`updated patient info of ${id}`)
    return shim.Success(nil)
}

func (s *RecordsContract) updateDoctorInfo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    //fmt.Println("inside  updateDoctorInfo")
    logger.Info("inside updateDoctorInfo")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get doctor record
    doctorRecordAsBytes, _  := APIstub.GetState(id)
    var doctorrecord = DoctorRecord{}
    json.Unmarshal(doctorRecordAsBytes, &doctorrecord)
    
    // updating the fields
    doctorrecord.Name = args[0]
    doctorrecord.Address = args[1]
    doctorrecord.Age = args[2]
    doctorrecord.Specialization = args[3]
    doctorrecord.WorkExperience = args[4]
   

    // updating the record
    newDoctorRecordAsBytes, _ := json.Marshal(doctorrecord)
    APIstub.PutState(id, newDoctorRecordAsBytes)
    logger.Info(`updated doctor info of {id}`)
    return shim.Success(nil)
}

func (s *RecordsContract) getDoctorInfo(APIstub shim.ChaincodeStubInterface) sc.Response {
    //fmt.Println("inside getDoctorInfo")
    logger.Info("inside getDoctorInfo")
	 // get enrollment id registered by user
	 id, _, _ := cid.GetAttributeValue(APIstub, "hf.EnrollmentID")
	 //id,err := cid.GetID(APIstub)
     //fmt.Println("EnrollmentID: ",id)
     logger.Debug("EnrollmentID: ",id)

	//  if err != nil {
	// 	 return shim.Error(err.Error())
	//  }

    // get record
     recordAsBytes, _  := APIstub.GetState(id)
    var doctorrecord = DoctorRecord{}
    json.Unmarshal(recordAsBytes, &doctorrecord)
    
    // get patients
    //var patients = doctorrecord.AllowedList
    //fmt.Println("doctorrecord: ", doctorrecord)
    logger.Info(`Retrieved doctor info of ${id}`)
    return shim.Success(recordAsBytes)

}

func main() {

    // Create a new Smart Contract
    err := shim.Start(new(RecordsContract))
    if err != nil {
        logger.Error("Error creating new Records Contracts:",err)
        //fmt.Printf("Error creating new Records Contract: %s", err)
    }
}

