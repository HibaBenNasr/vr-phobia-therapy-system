import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

const PatientInfo = () => {
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null); // { type: "success" | "error", text: string }

  const fetchPatientData = async (ID) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return console.log("user not logged in");
      const docRef = doc(db, "Users", user.uid, "Patients", ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data();
        setPatientData(data);
        console.log("data", docSnap.data());
        setFormData(data);
        setLoading(false);
      } else {
        console.log("no data found");
      }
    });
  };
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.set("interface", "PatientInfo");
    setSearchParams(searchParams);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const Id = params.get("userId");
    // console.log("id=", Id);
    if (Id) fetchPatientData(Id);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isDataChanged = (obj1, obj2) => {
    return JSON.stringify(obj1) !== JSON.stringify(obj2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation rules
    const newErrors = {};

    if (!formData.fname?.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname?.trim()) newErrors.lname = "Last name is required.";
    if (!formData.email?.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";

    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[0-9]{7,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number format.";

    if (formData.allergies && !formData.AllergiesDetails?.trim())
      newErrors.AllergiesDetails = "Please provide allergy details.";

    if (formData.MedicalCondition && !formData.MedicalConditionDetails?.trim())
      newErrors.MedicalConditionDetails =
        "Please provide medical condition details.";

    if (!formData.Sexe) newErrors.Sexe = "Please select a Sexe.";
    if (!formData.MaritalStatus)
      newErrors.MaritalStatus = "Please select marital status.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // stop if errors

    // Check if data changed
    if (!isDataChanged(formData, patientData)) {
      setStatusMessage({ type: "error", text: "No changes to save." });
      return;
    }

    try {
      // Save to Firestore
      const user = auth.currentUser;
      const patientId = new URLSearchParams(window.location.search).get(
        "userId"
      );
      const docRef = doc(db, "Users", user.uid, "Patients", patientId);

      await updateDoc(docRef, {
        ...formData,
        UpdatedAt: new Date(),
      });
      setStatusMessage({
        type: "success",
        text: "Patient information updated successfully.",
      });

      setPatientData(formData);

      // alert("Patient information updated successfully.");
    } catch (error) {
      console.error("Error updating document:", error);
      // alert("Failed to save changes.");
      setStatusMessage({ type: "error", text: "Failed to save changes." });
    }
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center mt-20 h-screen">
        <svg
          className="animate-spin w-48 h-48 text-blue-500 "
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
        <p className="mt-10">Loading...</p>
      </div>
    );
  const inputStyle =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-500 hover:ring-2 hover:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-none dark:hover:ring-2 dark:hover:ring-blue-500 dark:hover:border-blue-500";

  return (
    <div className="p-5 mt-16 mb-32 bg-white dark:bg-sky-900 shadow-md rounded-xl">
      {statusMessage && (
        <div
          className={`fixed z-50 top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-white ${
            statusMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
          {statusMessage.text}
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-2 font-bold"
            aria-label="Close message">
            ×
          </button>
        </div>
      )}

      <form className="p-5 container" onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="fname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              First Name
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              className={inputStyle}
              value={formData.fname || ""}
              onChange={handleChange}
            />
            {errors.fname && (
              <p className="text-red-600 text-sm mt-1">{errors.fname}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="lname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Last Name
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              className={inputStyle}
              value={formData.lname || ""}
              onChange={handleChange}
            />
            {errors.lname && (
              <p className="text-red-600 text-sm mt-1">{errors.lname}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="Sexe"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Sexe
            </label>
            <select
              id="Sexe"
              name="Sexe"
              className={inputStyle}
              value={formData.Sexe || ""}
              onChange={handleChange}>
              <option value="">Select Sexe</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            {errors.Sexe && (
              <p className="text-red-600 text-sm mt-1">{errors.Sexe}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="MaritalStatus"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Marital Status
            </label>
            <select
              id="MaritalStatus"
              name="MaritalStatus"
              className={inputStyle}
              value={formData.MaritalStatus || ""}
              onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
            {errors.MaritalStatus && (
              <p className="text-red-600 text-sm mt-1">
                {errors.MaritalStatus}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={inputStyle}
              value={formData.phone || ""}
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={inputStyle}
              value={formData.email || ""}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={inputStyle}
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="DateOfBirth"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Date of Birth
            </label>
            <input
              type="date"
              id="DateOfBirth"
              name="DateOfBirth"
              className={inputStyle}
              value={
                formData.DateOfBirth
                  ? new Date(formData.DateOfBirth.seconds * 1000)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          {/* Allergy Section */}
          <div className="border rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-500">
            <label className="flex items-center mb-2 text-base font-semibold text-gray-800 ">
              <input
                type="checkbox"
                name="allergies"
                checked={formData.allergies}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    allergies: checked,
                    AllergiesDetails: checked ? "" : "none",
                  }));
                }}
                className="mr-2"
              />
              Has Allergies
            </label>
            <textarea
              id="AllergiesDetails"
              name="AllergiesDetails"
              disabled={!formData.allergies}
              value={formData.AllergiesDetails}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white${
                !formData.allergies
                  ? "bg-gray-200 cursor-not-allowed dark:text-white "
                  : ""
              }`}
              placeholder="Describe allergies..."
              rows={3}
            />
            {errors.AllergiesDetails && (
              <p className="text-red-600 text-sm mt-1">{errors.fname}</p>
            )}
          </div>

          {/* Medical Condition Section */}
          <div className="border rounded-xl p-4 mb-4 bg-gray-50 dark:bg-gray-500">
            <label className="flex items-center mb-2 text-base font-semibold text-gray-800">
              <input
                type="checkbox"
                name="MedicalCondition"
                checked={formData.MedicalCondition}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    MedicalCondition: checked,
                    MedicalConditionDetails: checked ? "" : "none",
                  }));
                }}
                className="mr-2"
              />
              Has Medical Condition
            </label>
            <textarea
              id="MedicalConditionDetails"
              name="MedicalConditionDetails"
              disabled={!formData.MedicalCondition}
              value={formData.MedicalConditionDetails}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white${
                !formData.MedicalCondition
                  ? "bg-gray-200 cursor-not-allowed dark:text-white "
                  : ""
              }`}
              placeholder="Describe medical condition..."
              rows={3}
            />
            {errors.MedicalConditionDetails && (
              <p className="text-red-600 text-sm mt-1">
                {errors.MedicalConditionDetails}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default PatientInfo;
