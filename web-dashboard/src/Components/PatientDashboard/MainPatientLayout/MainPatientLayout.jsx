import React, { useEffect, useRef, useState } from "react";
import { auth, db, RTdatabase } from "../../../firebase/firebase";
import {
  doc,
  getDoc,
  orderBy,
  query,
  limit,
  collection,
} from "firebase/firestore";
import { get, onValue, ref, update } from "firebase/database";
import StartSessionModal from "./StartSessionModal";
import SessionControls from "./SessionControls";
import { startNewSession, endSessionData } from "./utils/sessionHelpers";
import Charts from "./Charts";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";
import { onAuthStateChanged } from "firebase/auth";
import LastSessionSummary from "./LastSessionSummary";

const MainPatientLayout = ({ goToHistory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    searchParams.set("interface", "MainPatientLayout");
    setSearchParams(searchParams);
  }, []);

  const [patientData, setPatientData] = useState([]);
  const [newSession, setNewSession] = useState({
    Scene: "",
    InitialLevel: -2,
    Mode: "",
  });
  const [modelVisible, setModelVisible] = useState(false);
  const [patientID, setPatientID] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [equipStat, setEquipStat] = useState([]);
  const [sessionStat, setSessionStat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(-2);
  const [currentMode, setCurrentMode] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);

  const phobias = ["Glossophobia", "Acrophobia"];
  const levels = [0, 1, 2, 3, 4, 5];

  // Fetch patient data
  const fetchPatientData = async (ID) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const docRef = doc(db, "Users", user.uid, "Patients", ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatientData(docSnap.data());
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const Id = params.get("userId");
    if (Id) {
      setPatientID(Id);
      fetchPatientData(Id);
    }

    if (!modelVisible) {
      setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
    }
  }, [modelVisible]);

  // Equipment and session validation
  useEffect(() => {
    const equipRef = ref(RTdatabase, "pre_session_validation/equipment_ready/");
    const sessionRef = ref(RTdatabase, "pre_session_validation/session/");

    const unsubscribe = onValue(equipRef, (snapshot) => {
      setEquipStat(snapshot.val());
      setLastOnline(snapshot.val().sensors_ready.last_online);
      setLoading(false);
    });

    const unsubscribe2 = onValue(sessionRef, (snapshot) => {
      setSessionStat(snapshot.val());
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  const isRecentlyOnline = (lastOnlineTimestamp) => {
    const now = Date.now();
    const lastOnlineMs = Number(lastOnlineTimestamp) * 1000;
    return now - lastOnlineMs < 20000;
  };

  // Poll every second to check freshness
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastOnline) {
        const status = isRecentlyOnline(lastOnline);
        setIsOnline(status);
        if (!status && sessionID && currentMode === "auto") {
          onToggleMode("manual");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastOnline]);

  //set session id
  useEffect(() => {
    if (sessionStat?.start_session && sessionStat?.session_id) {
      setSessionID(sessionStat.session_id);
    } else {
      setSessionID("");
    }
  }, [sessionStat]);

  useEffect(() => {
    if (sessionStat?.start_session === false) {
      handleEndSession();
    }
  }, [sessionStat?.start_session]);

  // Fetch session details (sessionID, currentLevel, mode) from DB continuously
  useEffect(() => {
    if (!sessionID) return;

    const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);

    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentLevel(data.current_level);
        setCurrentMode(data.mode);
      }
    });

    return () => unsubscribe();
  }, [sessionID]);

  useEffect(() => {
    if (!sessionID) return;

    const modeRef = ref(RTdatabase, `sessions/${sessionID}/mode`);

    const unsubscribe = onValue(modeRef, (snapshot) => {
      const modeFromDB = snapshot.val();
      if (modeFromDB === "manual" || modeFromDB === "auto") {
        setCurrentMode(modeFromDB);
      }
    });

    return () => unsubscribe();
  }, [sessionID]);

  // Start session
  const handleStartSession = async () => {
    if (newSession.Scene && newSession.InitialLevel !== -2) {
      setCurrentMode(newSession.Mode);
      setModelVisible(false);
      setTimeout(async () => {
        try {
          await startNewSession(
            patientID,
            newSession,
            setSessionID,
            setCurrentLevel,
            newSession.Mode
          );
          setCurrentMode(newSession.Mode);
          setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
          addLog("Session started");
        } catch (err) {
          console.error("Failed to start session", err);
        }
      }, 100);
    } else {
      console.log("Invalid session data");
    }
  };

  // End session
  const handleEndSession = async () => {
    if (patientID && sessionID) {
      try {
        await endSessionData(patientID, sessionID, currentLevel);
        setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
        // setPatientID("");
        setSessionID("");
        setCurrentLevel(-2);
        addLog("Session ended");
      } catch (err) {
        console.error("Failed to end session", err);
      }
    } else {
      // console.log("Missing patient or session ID");
    }
  };

  // Update current level in DB
  const updateCurrentLevelInDB = (newLevel) => {
    if (newLevel < 0 || newLevel > 5) return;
    if (!sessionID) return;

    const levelRef = ref(RTdatabase, `sessions/${sessionID}`);
    const timestamp = Date.now();

    const updateData = {
      current_level: newLevel,
      last_updated: timestamp,
    };

    console.log(
      "mode " + currentMode + " sessionStat.Scene " + sessionStat.scene
    );
    if (currentMode == "manual" && sessionStat.scene == "Acrophobia") {
      updateData[`level_transitions/${timestamp}`] = {
        mode: currentMode,
        level: newLevel,
      };
    }

    update(levelRef, updateData)
      .then(() => {
        console.log("Updated current level to:", newLevel);
      })
      .catch((err) => {
        console.error("Error updating current level:", err);
      });
  };

  // Update mode in DB
  const updateModeInDB = (newMode) => {
    if (!sessionID) return;

    const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);
    update(sessionRef, {
      mode: newMode,
    })
      .then(() => {
        console.log("Mode updated in the database:", newMode);
      })
      .catch((err) => {
        console.error("Error updating mode in database:", err);
      });
  };

  useEffect(() => {
    if (!sessionID) return;

    const checkHeadsetStatus = () => {
      if (equipStat?.headset_ready === false) {
        console.log("Headset disconnected. Ending session...");
        addLog("Headset disconnected. Ending session...");
        handleEndSession(); // Call your session-ending logic
      } else {
        addLog("Headset connected");
      }
    };

    checkHeadsetStatus(); // Check immediately when sessionID or equipStat changes
  }, [sessionID, equipStat?.headset_ready]);

  // Handle mode toggle
  const onToggleMode = (modeChosen) => {
    const currMode = currentMode;
    setCurrentMode(isRecentlyOnline(lastOnline) ? modeChosen : "manual"); // Update local state
    updateModeInDB(isRecentlyOnline(lastOnline) ? modeChosen : "manual"); // Update Firebase
    addLog(
      `Mode changed to ${isRecentlyOnline(lastOnline) ? modeChosen : "manual"}`
    );
  };

  // Sensor availability change
  useEffect(() => {
    if (sessionID) {
      addLog(
        `Sensors are ${
          isRecentlyOnline(lastOnline) ? "available" : "unavailable"
        }`
      );
    }
  }, [isRecentlyOnline(lastOnline)]);

  // Track level changes
  const [prevLevel, setPrevLevel] = useState(-2);
  useEffect(() => {
    if (sessionID && currentLevel !== prevLevel) {
      addLog(`Level changed to ${currentLevel}`);
      setPrevLevel(currentLevel);
    }
  }, [currentLevel]);

  //Track stress level
  useEffect(() => {
    if (!sessionID) return;

    const stressRef = ref(RTdatabase, `sessions/${sessionID}/stress_state`);
    const unsubscribe = onValue(stressRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setStressLevel(value);
      }
    });

    return () => unsubscribe();
  }, [sessionID]);

  const getColorClass = (level) => {
    switch (level) {
      case "very high":
        return "bg-red-600 animate-pulse";
      case "high":
        return "bg-orange-500 animate-pulse";
      case "neutral":
        return "bg-green-600 animate-pulse";
      case "no_sensors":
        return "bg-zinc-950 animate-pulse";
      default:
        return "bg-gray-400";
    }
  };

  //Track notes
  const [lastNoteTimestamp, setLastNoteTimestamp] = useState(null);

  useEffect(() => {
    if (!sessionID) return;

    const notesRef = ref(RTdatabase, `sessions/${sessionID}/notes`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const timestamps = Object.keys(data).map(Number);
        const latest = Math.max(...timestamps);

        if (latest !== lastNoteTimestamp) {
          setLastNoteTimestamp(latest);
          addLog(`Note: ${data[latest]}`);
        }
      }
    });

    return () => unsubscribe();
  }, [sessionID, lastNoteTimestamp]);

  const logEndRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const addLog = (msg) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-1 mt-14 ">
      <SessionControls
        sessionStat={sessionStat}
        onStartClick={() => setModelVisible(true)}
        onEndClick={handleEndSession}
        onLevelUp={() => {
          if (currentLevel < 5) updateCurrentLevelInDB(currentLevel + 1);
        }}
        onLevelDown={() => {
          if (currentLevel > 0) updateCurrentLevelInDB(currentLevel - 1);
        }}
        currentLevel={currentLevel}
        onToggleMode={onToggleMode}
        sensorsOn={isRecentlyOnline(lastOnline)}
        mode={currentMode}
      />

      <StartSessionModal
        isVisible={modelVisible}
        onClose={() => setModelVisible(false)}
        onConfirm={handleStartSession}
        newSession={newSession}
        setNewSession={setNewSession}
        headStat={equipStat.headset_ready}
        sensorStat={isRecentlyOnline(lastOnline)}
        phobias={phobias}
        levels={levels}
        onModeToggle={onToggleMode}
      />
      <div className="mb-3">
        {" "}
        <Charts sessionStat={sessionStat} />
      </div>

      <div className="flex flex-row mb-3 w-full">
        {/* equipment availability  */}
        <div className="pt-1 px-1 basis-1/3 min-w-0 flex flex-col bg-white dark:bg-sky-900 shadow-xs rounded-xl mr-3">
          <div className="text-center p-2 mb-1 dark:text-white">
            Equipment Availability
          </div>
          <div className="p-2 mb-1">
            <p className="text-center flex items-center justify-between dark:text-white">
              VR Headset:{" "}
              <span>
                {equipStat.headset_ready ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <CgUnavailable size={20} color="red" />
                )}
              </span>
            </p>
            <hr />
            <p className="text-center flex items-center justify-between dark:text-white">
              Sensors:{" "}
              <span>
                {isRecentlyOnline(lastOnline) ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <CgUnavailable size={20} color="red" />
                )}
              </span>
            </p>
          </div>
        </div>
        {/* end equipment availability  */}

        {/* live session log  */}
        <div className="pt-2 px-1 basis-1/3 min-w-0 bg-white flex flex-col dark:bg-sky-900 shadow-xs rounded-xl mr-3">
          <div className="text-center text-m font-semibold px-4 py-1 border-b dark:border-white dark:text-white">
            Live Session Logs
          </div>
          <div className="text-sm flex-1 px-4 py-2 mb-3 overflow-y-auto max-h-24 space-y-2">
            {logs.map((log, idx) => (
              <div key={idx} className="text-sky-900 dark:text-gray-200">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
        {/* end live session log  */}

        {/* stress state card  */}
        <div className=" basis-1/3 min-w-0 bg-white flex flex-col dark:bg-sky-900 shadow-xs rounded-xl mr-3">
          <div
            className={` p-4 rounded-xl shadow-md  h-full text-white transition-all duration-300 ease-in-out ${
              sessionStat?.start_session
                ? !isRecentlyOnline(lastOnline)
                  ? getColorClass("no_sensors")
                  : getColorClass(stressLevel)
                : "bg-gray-500"
            }`}>
            <div className="text-lg font-semibold mb-1">Stress Level</div>
            <div className="text-2xl tracking-wide">
              {sessionStat?.start_session
                ? !isRecentlyOnline(lastOnline)
                  ? "Sensor not connected"
                  : stressLevel
                  ? stressLevel.replace("_", " ").toUpperCase()
                  : "Loading..."
                : "Session not started"}
            </div>
          </div>
        </div>
        {/* end stress state card  */}
      </div>
      <LastSessionSummary patientID={patientID} goToHistory={goToHistory} />
    </div>
  );
};

export default MainPatientLayout;
