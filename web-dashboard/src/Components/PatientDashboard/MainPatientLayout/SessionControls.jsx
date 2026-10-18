import React, { useEffect, useState } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import ToggleSwitch from "./ToggleSwitch";
import { get, ref } from "firebase/database";
import { RTdatabase, db } from "../../../firebase/firebase";

const SessionControls = ({
  sessionStat,
  onStartClick,
  onEndClick,
  onLevelUp,
  onLevelDown,
  currentLevel,
  onToggleMode,
  sensorsOn,
  mode,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    let interval = null;

    const startTimerFromFirebase = async () => {
      if (sessionStat.start_session && sessionStat.session_id) {
        const startTimeRef = ref(
          RTdatabase,
          `sessions/${sessionStat.session_id}/start_time`
        );

        try {
          const snapshot = await get(startTimeRef);
          if (snapshot.exists()) {
            const startTimestamp = snapshot.val(); // 10-digit UNIX timestamp in seconds
            const now = Math.floor(Date.now() / 1000);
            setSecondsElapsed(now - startTimestamp);

            interval = setInterval(() => {
              setSecondsElapsed((prev) => prev + 1);
            }, 1000);
          }
        } catch (error) {
          console.error("Error fetching start time from Firebase:", error);
        }
      } else {
        clearInterval(interval);
        setSecondsElapsed(0);
      }
    };

    startTimerFromFirebase();

    // if (sessionStat.start_session) {
    //   interval = setInterval(() => {
    //     setSecondsElapsed((prev) => prev + 1);
    //   }, 1000);
    // } else {
    //   clearInterval(interval);
    //   setSecondsElapsed(0);
    // }
    return () => clearInterval(interval);
  }, [sessionStat.start_session]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <div className="flex flex-row mb-3 h-full">
      <div className="w-full bg-white mr-2 flex items-center justify-around dark:bg-sky-900 shadow-xs rounded-xl">
        {/* Start Button */}
        <button
          className={`m-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-2 py-2.5 text-center dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800 ${
            sessionStat.start_session ? "disabled cursor-not-allowed" : ""
          }`}
          onClick={onStartClick}
          disabled={sessionStat.start_session}>
          Start Session
        </button>

        {/* End Button */}
        <button
          className={`m-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-2 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ${
            !sessionStat.start_session ? "disabled cursor-not-allowed" : ""
          }`}
          onClick={onEndClick}
          disabled={!sessionStat.start_session}>
          End Session
        </button>

        {/* Level Controls */}
        <div className="flex items-center">
          <button
            className={`my-3 mx-1 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-2 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
              mode !== "manual" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (mode === "manual" && currentLevel < 5) onLevelUp();
            }}
            disabled={mode !== "manual"}
            aria-label="Level Up">
            <ImArrowUp className="text-l mx-auto" />
          </button>
          <p className="m-2 p-2.5 dark:text-white">
            Level {currentLevel != -2 ? ": " + currentLevel : ""}
          </p>
          <button
            className={`my-3 mx-1 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-2 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
              mode !== "manual" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (mode === "manual" && currentLevel > 0) onLevelDown();
            }}
            disabled={mode !== "manual"}
            aria-label="Level Down">
            <ImArrowDown className="text-l mx-auto" />
          </button>
        </div>

        {/* Toggle */}

        <div className="w-1/5 flex items-center justify-center space-x-6">
          <ToggleSwitch
            labelOn="auto"
            labelOff="manual"
            onToggle={onToggleMode}
            sensorsOn={sensorsOn}
            currentMode={mode}
          />
          {sessionStat.start_session && (
            <span className="bg-black text-green-400 font-mono text-lg px-3 py-1 rounded-md shadow-inner">
              {formatTime(secondsElapsed)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionControls;
