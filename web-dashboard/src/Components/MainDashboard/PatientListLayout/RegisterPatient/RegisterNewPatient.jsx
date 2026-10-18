import React, { useState, createContext } from "react";
import Stepper from "./Stepper";
import FinalStep from "./FinalStep";
import StepperControl from "./StepperControl";
import { StepperContext } from "../../../../contexts/StepperContext";
import DetailsStep from "./DEtailsStep";
import BasicInformationStep from "./BasicInformationStep";
import ContactStep from "./ContactStep";

const RegisterNewPatient = ({ onClick }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [userData, setUserData] = useState("");

  const [finalData, setFinalData] = useState([]);

  const steps = ["Basic Information", "Contact","Details", "Complete"];


  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <BasicInformationStep />;
        case 2:
          return <ContactStep />;
      case 3:
        return <DetailsStep />;
      case 4:
        return <FinalStep />;
      default:
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;
    direction == "next" ? newStep++ : newStep--;
    //check if step
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <div className="">
      <div className="flex justify-between">
        <h1>RegisterNewPatient</h1>
        <button onClick={onClick}>Close</button>
      </div>

      <div className="container horizontal mt-5">
        {/*Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />
        {/* Display components  */}
        <div className="mt-5 p-5">
          <StepperContext.Provider
            value={{
              userData,
              setUserData,
              finalData,
              setFinalData,
            }}
          >
            {displayStep(currentStep)}
          </StepperContext.Provider>
        </div>
      </div>

      {/* Navigation controls */}

      {currentStep!= steps.length &&
      <StepperControl
        handleClick={handleClick}
        currentStep={currentStep}
        steps={steps}
        userData= {userData}
      />
    }
    </div>
  );
};

export default RegisterNewPatient;
