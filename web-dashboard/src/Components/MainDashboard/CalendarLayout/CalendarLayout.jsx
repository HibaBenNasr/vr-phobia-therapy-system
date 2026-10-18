import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Model from "react-modal";
import { setHours, setMinutes } from "date-fns";

import { BiCalendar } from "react-icons/bi";
import { FaAddressCard } from "react-icons/fa";

import { auth, db } from "../../../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const CalendarLayout = () => {
  const [newEvent, setNewEvent] = useState({ title: "", start: "" });
  const [allEvents, setAllEvents] = useState();
  const [addEventIsCorrect, setAddEventIsCorrect] = useState(true);

  function handleAddEvent() {
    if (
      newEvent.title.trim() !== "" &&
      newEvent.start instanceof Date &&
      !isNaN(newEvent.start)
    ) {
      setModelVisible(false);
      addAppointment();
    } else {
      setAddEventIsCorrect(false);
    }
  }

  const [ModelVisible, setModelVisible] = useState(false);

  const fetchAppointments = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      const patientsRef = collection(db, "Users", user.uid, "Appointments");

      try {
        const querySnapshot = await getDocs(patientsRef);
        const Appointments = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: data.PatientName,
            start: data.AppointmentTime.toDate(), // Timestamp → JS Date
            className: ["bg-blue-500 text-white "],
          };
        });
        console.log(Appointments);
        setAllEvents(Appointments);
        // setPatientsList(patientsData); // store in state
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    });
  };

  const addAppointment = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const AppointmentData = {
      PatientName: newEvent.title,
      AppointmentTime: newEvent.start,
    };

    try {
      const subCollectionRef = collection(
        db,
        "Users",
        user.uid,
        "Appointments"
      );

      await addDoc(subCollectionRef, AppointmentData);

      console.log("Document added successfully");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (!ModelVisible) {
      setAddEventIsCorrect(true);
      setNewEvent({ title: "", start: "" });
    }
  }, [ModelVisible]);

  return (
    <div className="p-3 mt-16 z-40 bg-white dark:bg-sky-900 transition-all duration-300 shadow-l rounded-xl">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={() => setModelVisible(true)}>
        Add New Appointment
      </button>

      <Model
        isOpen={ModelVisible}
        onRequestClose={() => setModelVisible(false)}
        className="relative overflow-visible p-6 bg-white w-full max-w-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg absolute "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        ariaHideApp={false}>
        <div className="flex flex-col items-center">
          <h1>Add New Appointment</h1>
          <div className="w-2/3  my-5">
            <label
              className={`pl-10 block mb-2 text-sm font-medium ${
                addEventIsCorrect
                  ? "text-gray-900 dark:text-white"
                  : "text-red-700 dark:text-red-500"
              }`}>
              Patient Name
            </label>
            <div className="flex justify-between items-center">
              <FaAddressCard className="mr-2" size={30} />
              <input
                type="text"
                placeholder="Add Patient Name"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className={`border text-sm rounded-lg block w-full p-2.5 capitalize${
                  addEventIsCorrect
                    ? "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500   outline-blue-500"
                    : "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500  outline-red-500"
                }`}
              />
            </div>

            {addEventIsCorrect ? (
              ""
            ) : (
              <p className="pl-10 mt-2 text-sm text-red-600 dark:text-red-500">
                This filled Is Required!
              </p>
            )}
          </div>
          <div className=" w-2/3 mb-5 ">
            <div className="flex justify-between items-center ">
              <BiCalendar size={30} className="mr-2" />
              <DatePicker
                placeholderText="Start date"
                selected={newEvent.start}
                className={`cursor-pointer border text-sm rounded-lg block w-full p-2.5 h-15 ${
                  addEventIsCorrect
                    ? "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500   outline-blue-500"
                    : "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500  outline-red-500"
                }`}
                onChange={(start) => setNewEvent({ ...newEvent, start })}
                isClearable
                showTimeSelect
                minTime={setHours(setMinutes(new Date(), 30), 7)}
                maxTime={setHours(setMinutes(new Date(), 0), 20)}
                wrapperClassName="w-full"
                minDate={new Date()}
              />
            </div>
            {addEventIsCorrect ? (
              ""
            ) : (
              <p className="pl-10 mt-2 text-sm text-red-600 dark:text-red-500">
                This filled Is Required!
              </p>
            )}
          </div>

          <div className="w-2/3 flex justify-around ">
            <button
              type="submit"
              onClick={() => setModelVisible(false)}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
              cancel
            </button>

            <button
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleAddEvent}>
              Confirm
            </button>
          </div>
        </div>
      </Model>

      <div className="z-20">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          slotMinTime={"08:00"}
          slotMaxTime={"20:00"}
          initialView={"dayGridMonth"}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          height={"auto"}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          selectable={true}
          nowIndicator={true}
          dayMaxEvents={true} // allow "more" link when too many events
          events={allEvents}
        />
      </div>
    </div>
  );
};

export default CalendarLayout;
