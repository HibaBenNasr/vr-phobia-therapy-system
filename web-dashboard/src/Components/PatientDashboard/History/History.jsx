import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth, db, RTdatabase } from "../../../firebase/firebase";
import { get, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const History = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const patientID = searchParams.get("userId");
  const [sessions, setSessions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({}); // key by session id
  useEffect(() => {
    searchParams.set("interface", "History");
    setSearchParams(searchParams);
  }, []);

  useEffect(() => {
    if (!patientID) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      fetchSessionSummaries(user, patientID).then(setSessions);
    });
    return () => unsubscribe();
  }, [patientID]);

  const fetchSessionSummaries = async (user, patientID) => {
    const colRef = collection(
      db,
      "Users",
      user.uid,
      "Patients",
      patientID,
      "Sessions"
    );
    const snapshot = await getDocs(colRef);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.StartTime.seconds - a.StartTime.seconds);
  };

  const fetchRealtimeSessionDetails = async (sessionID) => {
    const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);
    const snapshot = await get(sessionRef);
    return snapshot.val();
  };

  const onToggle = async (sessionID) => {
    if (expandedId === sessionID) return setExpandedId(null);
    setExpandedId(sessionID);
    if (!sessionDetails[sessionID]) {
      const details = await fetchRealtimeSessionDetails(sessionID);
      setSessionDetails((prev) => ({ ...prev, [sessionID]: details }));
    }
  };

  return (
    <div className="p-5 mt-16 mb-32 bg-white dark:bg-sky-900 shadow-md rounded-xl">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Session History
        </h2>
        <div className="overflow-x-auto  ">
          <table className="w-full table-auto border-separate border-spacing-y-2 min-h-[255px]">
            <thead className="bg-indigo-600 text-white dark:bg-indigo-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Phobia</th>
                <th className="px-4 py-3">Initial Level</th>
                <th className="px-4 py-3">Final Level</th>
                <th className="px-4 py-3">Time Spent</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <React.Fragment key={session.id}>
                  <tr className="even:bg-gray-100 dark:even:bg-gray-500 bg-white dark:bg-gray-400 shadow rounded-lg">
                    <td className="px-4 py-3 text-center">
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).format(new Date(session.StartTime.seconds * 1000))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white px-2 py-1 rounded">
                        {session.Scene}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.InitialLevel}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.EndLevel}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.EndTime && session.StartTime
                        ? `${Math.round(
                            (session.EndTime.seconds -
                              session.StartTime.seconds) /
                              60
                          )} min`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggle(session.id)}
                        className="text-indigo-600 dark:text-indigo-900 hover:underline font-medium">
                        {expandedId === session.id ? "▲ Hide" : "▼ View"}
                      </button>
                    </td>
                  </tr>

                  {expandedId === session.id && (
                    <tr className="bg-gray-50 dark:bg-gray-900 text-sm">
                      <td colSpan="6" className="px-4 py-5">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="max-h-64 overflow-y-auto p-2 bg-white dark:bg-gray-500 rounded-lg">
                            <strong className=" block font-semibold mb-1 text-center">
                              Level of exposure Transitions
                            </strong>
                            <ul className="list-disc ml-5 space-y-1">
                              {sessionDetails[session.id]?.level_transitions ? (
                                Object.entries(
                                  sessionDetails[session.id].level_transitions
                                ).map(([ts, val]) => (
                                  <li key={ts}>
                                    {new Intl.DateTimeFormat("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    }).format(
                                      new Date(session.StartTime.seconds * 1000)
                                    )}{" "}
                                    - Level {val.level} ({val.mode})
                                  </li>
                                ))
                              ) : (
                                <li className="italic text-gray-500">N/A</li>
                              )}
                            </ul>
                          </div>
                          <div className="max-h-64 overflow-y-auto p-2 bg-white dark:bg-gray-500 rounded-lg">
                            <strong className="block mb-1 text-center">
                              Stress Level Changes
                            </strong>
                            {sessionDetails[session.id]?.sensorData ? (
                              <ul className="list-disc ml-5 space-y-1">
                                {(() => {
                                  const entries = Object.entries(
                                    sessionDetails[session.id].sensorData
                                  ).sort((a, b) => Number(a[0]) - Number(b[0]));

                                  let last = null;
                                  return entries
                                    .filter(([_, d]) => {
                                      if (d.stress_level !== last) {
                                        last = d.stress_level;
                                        return true;
                                      }
                                      return false;
                                    })
                                    .map(([ts, d]) => (
                                      <li key={ts}>
                                        {new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: false,
                                        }).format(
                                          new Date(
                                            session.StartTime.seconds * 1000
                                          )
                                        )}{" "}
                                        -{" "}
                                        <span className="capitalize">
                                          {d.stress_level}
                                        </span>
                                      </li>
                                    ));
                                })()}
                              </ul>
                            ) : (
                              <p className="italic text-gray-500">
                                Loading or no data
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
