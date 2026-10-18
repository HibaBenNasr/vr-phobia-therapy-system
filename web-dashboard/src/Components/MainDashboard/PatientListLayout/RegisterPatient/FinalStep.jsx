import React, { useContext, useEffect, useState, useRef } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
import { auth, db } from "../../../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const FinalStep = () => {
  const hasRun = useRef(false);
  const { userData, setUserData } = useContext(StepperContext);

  const [status, setStatus] = useState("");

  //firebase

  const addUserData = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const uid = user.uid;

    const PatientFinalData = {
      fname: userData["fname"],
      lname: userData["lname"],
      sexe: userData["gender"],
      MaritalStatus: userData["MaritalStatus"],
      DateOfBirth: new Date(
        parseInt(userData["year"]),
        parseInt(userData["month"]) - 1,
        parseInt(userData["day"])
      ),
      phone: userData["phone"],
      email: userData["email"],
      address: userData["address"],
      allergies: userData["allergies"] == "true",
      AllergiesDetails: userData["AllergiesDetails"],
      MedicalCondition: userData["MedicalCondition"] == "true",
      MedicalConditionDetails: userData["MedicalConditionDetails"],
      Created: new Date(),
    };

    try {
      const subCollectionRef = collection(db, "Users", uid, "Patients");

      await addDoc(subCollectionRef, PatientFinalData);

      console.log("Document added successfully");
      setStatus("success");
    } catch (err) {
      console.error("Error adding document:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (hasRun.current) return;

    addUserData();
    hasRun.current = true;
  }, []);

  console.log(status);

  return (
    <div className="container md:mt-10">
      <div className="flex flex-col items-center">
        <div className="text-green-400">
          {status == "success" ? (
            <svg
              className="w-24 h-24"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : status == "error" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
          ) : (
            <svg
              className="animate-spin w-24 h-24 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
        </div>
        <div className="mt-3 text-xl font-semibold uppercase text-green-500">
          {status == "success" ? (
            <>All Done! </>
          ) : status == "error" ? (
            <>Oops!</>
          ) : (
            <>Loading</>
          )}
        </div>
        <div className="text-lg font-semibold text-gray-500">
          {status == "success" ? (
            <>New Patient has been added to the database. </>
          ) : status == "error" ? (
            <>An Error Has Occurred!</>
          ) : (
            <>Wait for a moment</>
          )}
        </div>
        <a href="/MainDashboard" className="mt-10">
          <button
            className="h-10 px-5 text-green-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:shadow-outline hover:bg-green-500 hover:text-green-100"
            hidden={!(status == "success")}>
            Close
          </button>
        </a>
      </div>
    </div>
  );
};

export default FinalStep;
