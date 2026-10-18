import PatientHeader from "./PatientHeader";
import MainPatientLayout from "./MainPatientLayout/MainPatientLayout";
import PatientSidebar, { PatientSidebarItem } from "./PatientSidebar";
import React, { useEffect, useState } from "react";
import { FaRegListAlt, FaCalendarAlt, FaNotesMedical } from "react-icons/fa";
import History from "./History/History";
import PatientInfo from "./PatientInfo/PatientInfo";

const PatientDashboard = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const item = params.get("interface");
    const Id = params.get("userId");
    if (item == "PatientInfo") {
      handlePatientSidebarItemClick("PatientInfo");
    } else if (item == "History") {
      handlePatientSidebarItemClick("History");
    } else {
      handlePatientSidebarItemClick("MainPatientLayout");
    }
  }, []);

  //manage sidebar items
  const [activeItemPatient, setActiveItemPatient] = useState(""); // Track active item

  const handlePatientSidebarItemClick = (item) => {
    setActiveItemPatient(item); // Update active item when clicked
  };

  ///end manage sidebar items

  //theme
  const currentTheme = localStorage.getItem("currentTheme");

  const [theme, setTheme] = useState(currentTheme ? currentTheme : "light");

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);
  //end theme

  useEffect(() => {
    if (theme == "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  return (
    <div className=" mt-2 bg-gray-100 dark:bg-gray-900 p-3 ">
      <div className="flex bg-gray-100 dark:bg-gray-900">
        <PatientSidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
          theme={theme}>
          <PatientSidebarItem
            icon={<FaRegListAlt />}
            text="Main"
            active={activeItemPatient == "MainPatientLayout"}
            onClick={() => handlePatientSidebarItemClick("MainPatientLayout")}
          />
          <PatientSidebarItem
            icon={<FaCalendarAlt />}
            text="History"
            active={activeItemPatient == "History"}
            onClick={() => handlePatientSidebarItemClick("History")}
          />
          <PatientSidebarItem
            icon={<FaNotesMedical />}
            text="Patient Info"
            active={activeItemPatient == "PatientInfo"}
            onClick={() => handlePatientSidebarItemClick("PatientInfo")}
          />
        </PatientSidebar>
        <div
          className={`w-full h-full  ${
            sidebarExpanded ? "ml-16 md:ml-56" : "ml-16"
          }`}>
          <PatientHeader
            setTheme={setTheme}
            expanded={sidebarExpanded}
            activeItemPatient={activeItemPatient}
          />

          {activeItemPatient == "MainPatientLayout" ? (
            <MainPatientLayout
              goToHistory={() => handlePatientSidebarItemClick("History")}
            />
          ) : activeItemPatient == "History" ? (
            <History />
          ) : activeItemPatient == "PatientInfo" ? (
            <PatientInfo />
          ) : (
            <p>Unknown status</p>
          )}
          {/* <MainPatientLayout /> */}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
