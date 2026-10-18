import React, { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";

const DetailsStep = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex justify-around">

      <div className="w-full mr-5">

        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
            {/* {" "} */}
            Any Known allergies ?
          </div>
          <div className=" my-2 p-1 flex justify-around">
            <div>
              <input
                onChange={handleChange}
                value="true"
                name="allergies"
                type="radio"
                checked={userData["allergies"] == "true"}
              />{" "}
              Yes
            </div>
            <div>
              <input
                onChange={handleChange}
                value="false"
                name="allergies"
                type="radio"
                checked={userData["allergies"] == "false"}
              />{" "}
              No
            </div>
          </div>
        </div>

        <div className="w-full mx-2 flex-1">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            If yes please specify:
          </label>
          <textarea
          disabled={userData["allergies"] == "false"}
            onChange={handleChange}
            value={userData["allergies"] == "false" ? userData["AllergiesDetails"]="none" : userData["AllergiesDetails"] || ""}
            name="AllergiesDetails"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Write here..."
          ></textarea>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
            {/* {" "} */}
            Any Medical condition ?
          </div>
          <div className=" my-2 p-1 flex justify-around">
            <div>
              <input
                onChange={handleChange}
                value="true"
                name="MedicalCondition"
                type="radio"
                checked={userData["MedicalCondition"] == "true"}
              />{" "}
              Yes
            </div>
            <div>
              <input
                onChange={handleChange}
                value="false"
                name="MedicalCondition"
                type="radio"
                checked={userData["MedicalCondition"] == "false"}
              />{" "}
              No
            </div>
          </div>
        </div>

        <div className="w-full mx-2 flex-1">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            If yes please specify:
          </label>
          <textarea
            onChange={handleChange}
            disabled={userData["MedicalCondition"] == "false"}
            value={userData["MedicalCondition"] == "false" ? userData["MedicalConditionDetails"]="none" : userData["MedicalConditionDetails"] || ""}
            name="MedicalConditionDetails"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Write here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
