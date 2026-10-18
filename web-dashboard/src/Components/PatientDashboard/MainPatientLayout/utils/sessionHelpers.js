import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { ref, set, update } from "firebase/database";
import { auth, db, RTdatabase } from "../../../../firebase/firebase";

// Set pre-session data in Realtime DB
export const setPreSessionData = async (scene, session_id, start_session) => {
  const preSessionRef = ref(RTdatabase, "pre_session_validation/session/");
  const updates = { scene, session_id, start_session };

  try {
    await update(preSessionRef, updates);
    console.log("Pre-session data updated");
  } catch (err) {
    console.error("Error setting pre-session data:", err);
  }
};

// Start session
export const startNewSession = async (
  patientID,
  newSession,
  setSessionID,
  setCurrentLevel,
  currentMode
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const startTime = Math.floor(Date.now() / 1000);
  const firestoreData = {
    StartTime: new Date(),
    InitialLevel: newSession.InitialLevel,
    Scene: newSession.Scene,
  };

  const sessionRef = collection(
    db,
    "Users",
    user.uid,
    "Patients",
    patientID,
    "Sessions"
  );

  const docRef = await addDoc(sessionRef, firestoreData);
  const sessionId = docRef.id;

  const realtimeData = {
    last_updated: startTime,
    current_level: newSession.InitialLevel,
    scene: newSession.Scene,
    mode: currentMode,
    patient_id: patientID,
    start_time: startTime,
    therapist_id: user.uid,
    stress_state: "neutral",
    level_transitions: {
      [startTime]: {
        mode: currentMode,
        level: newSession.InitialLevel,
      },
    },
  };

  await set(ref(RTdatabase, `sessions/${sessionId}`), realtimeData);
  await setPreSessionData(newSession.Scene, sessionId, true);

  setSessionID(sessionId);
  setCurrentLevel(newSession.InitialLevel);
  console.log("helper func ", currentMode);
  // setCurrentMode(newSession.Mode);

  return sessionId;
};

// End session
export const endSessionData = async (patientID, sessionID, finalLevel) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const sessionDocRef = doc(
    db,
    "Users",
    user.uid,
    "Patients",
    patientID,
    "Sessions",
    sessionID
  );

  const updateData = {
    EndTime: new Date(),
    EndLevel: finalLevel,
  };

  await updateDoc(sessionDocRef, updateData);
  await setPreSessionData("Home", "none", false);
};
