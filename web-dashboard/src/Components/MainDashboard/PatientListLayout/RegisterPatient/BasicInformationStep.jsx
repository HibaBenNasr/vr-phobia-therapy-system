import React, { useContext, useState } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";

const BasicInformationStep = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Arrays for day, month, year
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i - 2
  );

  return (
    <div className="flex flex-col">
      <form action="">
        <div className="flex">
          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
              First Name
            </div>
            <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
              <input
                onChange={handleChange}
                value={userData["fname"] || ""}
                name="fname"
                placeholder="Enter Last Name"
                type="text"
                className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                required
              />
            </div>
          </div>

          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
              {/* {" "} */}
              Last Name
            </div>
            <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
              <input
                onChange={handleChange}
                value={userData["lname"] || ""}
                name="lname"
                placeholder="Enter Last Name"
                type="text"
                className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                required
              />
            </div>
          </div>
        </div>

        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
            {/* {" "} */}
            Date of birth
          </div>
          <div className="my-2 p-1 flex  justify-between space-x-1">
            <select
              name="day"
              value={userData["day"] || ""}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required>
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            {/* Month */}
            <select
              name="month"
              value={userData["month"] || ""}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required>
              <option value="">Month</option>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              name="year"
              value={userData["year"] || ""}
              onChange={handleChange}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required>
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex">
          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
              Sexe
            </div>
            <div className=" my-2 p-1 flex">
              <div className="mr-5">
                <input
                  onChange={handleChange}
                  value="male"
                  name="gender"
                  type="radio"
                  checked={userData["gender"] == "male"}
                  required
                />{" "}
                Male
              </div>
              <div>
                <input
                  onChange={handleChange}
                  value="female"
                  name="gender"
                  type="radio"
                  checked={userData["gender"] == "female"}
                />{" "}
                Female
              </div>
            </div>
          </div>

          <div className="w-full mx-2 flex-1">
            <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
              Marital status
            </div>
            <div className=" my-2 p-1 flex">
              <div className="mr-5">
                <input
                  onChange={handleChange}
                  value="single"
                  name="MaritalStatus"
                  type="radio"
                  checked={userData["MaritalStatus"] == "single"}
                  required
                />{" "}
                Single
              </div>
              <div>
                <input
                  onChange={handleChange}
                  value="married"
                  name="MaritalStatus"
                  type="radio"
                  checked={userData["MaritalStatus"] == "married"}
                />{" "}
                Married
              </div>
              <div className="mx-5">
                <input
                  onChange={handleChange}
                  value="divorced"
                  name="MaritalStatus"
                  type="radio"
                  checked={userData["MaritalStatus"] == "divorced"}
                />{" "}
                Divorced
              </div>
              <div>
                <input
                  onChange={handleChange}
                  value="widowed"
                  name="MaritalStatus"
                  type="radio"
                  checked={userData["MaritalStatus"] == "widowed"}
                />{" "}
                Widowed
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BasicInformationStep;
