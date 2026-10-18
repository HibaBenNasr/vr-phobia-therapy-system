import React from "react";
import { LuLogOut, LuMoon, LuSun } from "react-icons/lu";
import { doSignOut } from "../../firebase/auth";

const PatientHeader = ({ setTheme, expanded, activeItemPatient }) => {
  const darkMode = () => {
    setTheme("dark");
  };

  const lightMode = () => {
    setTheme("light");
  };
  return (
    <div
      className={`flex top-0 fixed right-0 h-16 justify-between items-center p-1 transition-all duration-300 z-50 bg-white dark:bg-sky-900  ${
        expanded ? "left-16 md:left-56" : "left-16"
      }`}>
      <div>
        {/* <h1 className="text-xs">Patient </h1>
        <p className="text-xl font-semibold"> Section</p> */}
      </div>
      <div className="text-center dark:text-white">
        <p className="text-xl font-semibold">
          {activeItemPatient == "MainPatientLayout"
            ? "Manage Session"
            : activeItemPatient == "History"
            ? "History"
            : "Patient Infonformation"}
        </p>
        <h1 className="text-xs">Section </h1>
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex">
          <div className="flex items-center bg-zinc-300 dark:bg-[#24292F]  rounded-xl mr-5">
            <button
              className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-lg text-black dark:text-white "
              onClick={lightMode}>
              {" "}
              <LuSun />
            </button>
            <p className="text-black dark:text-white">|</p>
            <button
              className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-lg text-black dark:text-white"
              onClick={darkMode}>
              {" "}
              <LuMoon />
            </button>
          </div>
          {/* <button
            className="relative text-black dark:text-white mx-5 cursor-pointer"
            onClick={() => {
              doSignOut();
            }}>
            <LuLogOut size={25} />
          </button> */}
          <div className="">
            {" "}
            <button
              type="button"
              onClick={() => {
                doSignOut();
              }}
              className="text-black dark:text-white bg-zinc-300 dark:bg-[#24292F] hover:bg-zinc-200 dark:hover:bg-[#24292F]/90  focus:outline-none font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/30 mr-3 ">
              Logout&nbsp;&nbsp;
              <LuLogOut size={17} className="w-4 h-4 me-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
