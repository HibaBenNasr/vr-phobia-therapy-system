import { get, ref } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db, RTdatabase } from "../../../firebase/firebase";

const LastSessionSummary = ({ patientID, goToHistory }) => {
  const [summary, setSummary] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLatestSession = async () => {
      const user = auth.currentUser;
      if (!user || !patientID) return;

      const colRef = collection(
        db,
        "Users",
        user.uid,
        "Patients",
        patientID,
        "Sessions"
      );

      const snapshot = await getDocs(colRef);
      const sorted = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.StartTime.seconds - a.StartTime.seconds);

      if (sorted.length === 0) return;

      const last = sorted[0];
      const sessionID = last.id;

      const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);
      const rtSnap = await get(sessionRef);
      const data = rtSnap.val();

      if (!data) return;

      const sentence = `The last session was on ${new Date(
        data.start_time * 1000
      ).toLocaleString()}, the patient reached the level ${
        data.current_level
      } of the scenario ${data.scene} and the last stress state was ${
        data.stress_state
      }.`;

      console.log(sentence);

      setSummary(sentence);
      setData(data);
      setVisible(true);
    };

    fetchLatestSession();
  }, [patientID]);

  if (!visible) return null;
  const formattedDate = new Date(data.start_time * 1000).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Last Session Summary
        </h2>
        <p className="text-gray-700">
          The last session was on{" "}
          <span className="text-blue-600 font-semibold">{formattedDate}</span>,
          the patient reached level{" "}
          <span className="text-green-600 font-semibold">
            {data.current_level}
          </span>{" "}
          of the scenario{" "}
          <span className="text-purple-600 font-semibold">{data.scene}</span>{" "}
          and the last stress state was{" "}
          <span className="text-red-600 font-semibold">
            {data.stress_state}
          </span>
          .
        </p>
        <p className="text-sm text-gray-500 mt-4">
          For more details, go to{" "}
          <button
            onClick={() => goToHistory()}
            className="text-blue-500 font-medium hover:underline cursor-pointer">
            History
          </button>
          .
        </p>
        <div className="text-right mt-6">
          <button
            onClick={() => setVisible(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LastSessionSummary;
