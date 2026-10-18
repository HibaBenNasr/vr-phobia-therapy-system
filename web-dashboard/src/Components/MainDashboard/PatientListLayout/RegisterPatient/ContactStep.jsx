import React, { useContext } from 'react'
import { StepperContext } from '../../../../contexts/StepperContext'


const ContactStep = () => {
    const {userData, setUserData} = useContext(StepperContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
      };
  return (
    <div className="flex flex-col">

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
          {/* {" "} */}
          Phone Number
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["phone"] || ""}
            name="phone"
            placeholder="Enter Phone Number"
            type="text"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
            required={true} minLength="8"
            maxLength="8"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
          {/* {" "} */}
          Email
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["email"] || ""}
            name="email"
            placeholder="Enter Email"
            type="email"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>

      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-1 text-gray-500 text-xs leading-8 uppercase">
          {/* {" "} */}
          Address
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200 rounded">
          <input
            onChange={handleChange}
            value={userData["address"] || ""}
            name="address"
            placeholder="address"
            type="text"
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
          />
        </div>
      </div>
    </div>
  )
}


export default ContactStep