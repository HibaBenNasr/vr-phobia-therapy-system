import React from "react";


const StepperControl = ({handleClick, currentStep, steps, userData}) => {

function hasAllProperties(obj) {

    switch (currentStep) {
        case 1:
          return Object.keys(obj).length >= 7;
          case 2:
            return Object.keys(obj).length >= 10;
        case 3:
          return Object.keys(obj).length === 14;
        case 4:
          return true;
        default:
            return false;
      }  
  }

  function allFieldsFilled(obj) {
    return Object.values(obj).every(
      (value) => value !== null && value !== undefined && value !== ""
    );
  }

  

  return (
    <div className="container flex justify-around mt-0 mb-2">
        {/* back button  */}
        <button 
        onClick={()=> handleClick()}
        className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${currentStep == 1 ? "opacity-50 cursor-not-allowed": ""}`}>
          back
        </button>
        {/* next button  */}
        <button 
        disabled = {!hasAllProperties(userData) || !allFieldsFilled(userData)} 
        onClick={()=>handleClick("next")}
        className={`bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${hasAllProperties(userData) && allFieldsFilled(userData) ?"": "opacity-50 cursor-not-allowed"}`}  >
          {currentStep == steps.length -1 ? "Confirm": "Next"}
        </button>
      </div>
  )
}

export default StepperControl