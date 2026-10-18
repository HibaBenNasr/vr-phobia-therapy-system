import React, { useEffect, useState } from "react";

const ToggleSwitch = ({
  labelOn,
  labelOff,
  onToggle,
  sensorsOn,
  currentMode,
}) => {
  const [mode, setMode] = useState(currentMode);

  const handleClick = (selectedMode) => {
    setMode(selectedMode);
    onToggle && onToggle(selectedMode);
  };

  useEffect(() => {
    setMode(currentMode);
  }, [currentMode]);

  return (
    <div className="flex border border-gray-300 rounded-full overflow-hidden w-3/5 ">
      <button
        onClick={() => handleClick("auto")}
        className={`flex-1 py-2 text-sm font-medium transition-colors duration-200 ${
          mode === "auto"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        } ${!sensorsOn ? "cursor-not-allowed disabled" : ""}`}
        disabled={!sensorsOn}>
        Auto
      </button>
      <button
        onClick={() => handleClick("manual")}
        className={`flex-1 py-2 text-sm font-medium transition-colors duration-200 ${
          mode === "manual"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}>
        Manual
      </button>
    </div>
  );
};

export default ToggleSwitch;
