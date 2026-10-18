import React from "react";
import Model from "react-modal";
import { CgUnavailable } from "react-icons/cg";
import { FaCheckCircle } from "react-icons/fa";
import ToggleSwitch from "./ToggleSwitch";
const StartSessionModal = ({
  isVisible,
  onClose,
  onConfirm,
  newSession,
  setNewSession,
  headStat,
  sensorStat,
  phobias = [],
  levels = [],
  onModeToggle,
}) => {
  return (
    <Model
      isOpen={isVisible}
      onRequestClose={onClose}
      className="relative overflow-visible p-6 bg-white w-full max-w-[750px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg absolute"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      ariaHideApp={false}>
      <div className="flex flex-col items-center">
        <h1>Start New Session</h1>

        <div className="flex w-full items-center">
          {/* Left */}
          <div className="w-3/5 flex flex-col items-center mt-5">
            {/* Select Phobia */}
            <div className="w-2/3 my-1">
              <select
                name="phobia"
                onChange={(e) =>
                  setNewSession({ ...newSession, Scene: e.target.value })
                }
                className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                required>
                <option value="">Phobia</option>
                {phobias.map((phobia) => (
                  <option key={phobia} value={phobia}>
                    {phobia}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Level */}
            <div className="w-2/3 my-1">
              <select
                name="level"
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    InitialLevel: parseInt(e.target.value, 10),
                  })
                }
                className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                required>
                <option value="">Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Toggle */}
            <div className="w-2/3 my-1 flex justify-center">
              <ToggleSwitch
                labelOn="auto"
                labelOff="manual"
                onToggle={(mode) =>
                  setNewSession({ ...newSession, Mode: mode })
                }
                sensorsOn={sensorStat}
                currentMode=""
              />
            </div>
          </div>

          {/* Divider */}
          <div className="inline-block h-auto my-5 w-1 self-stretch bg-gray-500 dark:bg-white/10"></div>

          {/* Right */}
          <div className="w-2/5 mx-5">
            <div className="p-1">
              <p className="text-center flex items-center justify-between">
                Headset:{" "}
                <span>
                  {headStat ? (
                    <FaCheckCircle size={20} color="green" />
                  ) : (
                    <CgUnavailable size={20} color="red" />
                  )}
                </span>
              </p>
            </div>
            <hr />
            <div className="p-1">
              <p className="text-center flex items-center justify-between">
                Sensors:{" "}
                <span>
                  {sensorStat ? (
                    <FaCheckCircle size={20} color="green" />
                  ) : (
                    <CgUnavailable size={20} color="red" />
                  )}
                </span>
              </p>
            </div>
            <hr />
            <div className="p-1">
              <p className="text-center">
                {headStat && sensorStat
                  ? "All Fine"
                  : headStat && !sensorStat
                  ? "Can only use manual mode"
                  : !headStat && sensorStat
                  ? "Headset Disconnected"
                  : "Impossible to start new session"}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-2/3 flex justify-end">
          <button
            onClick={onClose}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={
              !headStat ||
              !newSession.Scene ||
              newSession.InitialLevel < 0 ||
              !newSession.Mode
            }
            className={`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
              !headStat ||
              !newSession.Scene ||
              newSession.InitialLevel < 0 ||
              !newSession.Mode
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}>
            Confirm
          </button>
        </div>
      </div>
    </Model>
  );
};

export default StartSessionModal;
