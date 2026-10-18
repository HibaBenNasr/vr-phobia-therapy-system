import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { RTdatabase } from "../../firebase/firebase";

const useEquipmentStatus = () => {
  const [equipStat, setEquipStat] = useState({});
  const [sessionStat, setSessionStat] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const equipRef = ref(RTdatabase, "pre_session_validation/equipment_ready/");
    const sessionRef = ref(RTdatabase, "pre_session_validation/session/");

    const unsub1 = onValue(equipRef, (snap) => {
      setEquipStat(snap.val());
      setLoading(false);
    });

    const unsub2 = onValue(sessionRef, (snap) => {
      setSessionStat(snap.val());
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  return { equipStat, sessionStat, loading };
};

export default useEquipmentStatus;
