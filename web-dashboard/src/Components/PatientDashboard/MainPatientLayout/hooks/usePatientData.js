import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const usePatientData = (patientID) => {
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!patientID) return;

    const fetchData = async () => {
      auth.onAuthStateChanged(async (user) => {
        const docRef = doc(db, "Users", user.uid, "Patients", patientID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setPatientData(docSnap.data());
      });
    };

    fetchData();
  }, [patientID]);

  return patientData;
};

export default usePatientData;
