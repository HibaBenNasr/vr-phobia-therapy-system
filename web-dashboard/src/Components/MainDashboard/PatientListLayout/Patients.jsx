import React, { cache, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { RiSearchLine } from "react-icons/ri";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";
import Model from "react-modal";
import RegisterNewPatient from "./RegisterPatient/RegisterNewPatient";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import DeletePopUp from "./PopUps/DeletePopUp";
import { BiTrash } from "react-icons/bi";

const Patients = () => {
  //Fetch pateints data
  const [patientsList, setPatientsList] = useState([]);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const fetchPatientsData = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);
      const patientsRef = collection(db, "Users", user.uid, "Patients");

      try {
        const querySnapshot = await getDocs(patientsRef);
        const patientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(patientsData)
        setPatientsList(patientsData); // store in state
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    });
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  // Table Columns
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.fname,
      sortable: true,
    },

    {
      name: "Last Name",
      selector: (row) => row.lname,
      sortable: (row) => row.lname,
    },

    {
      name: "Age",
      selector: (row) => {
        const timestamp = row.DateOfBirth;
        if (!timestamp || !timestamp.toDate) return "N/A";

        const birthDate = timestamp.toDate();
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust if birthday hasn't happened yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        return age;
      },
      sortable: true,
    },

    {
      name: "Added at",
      // selector: (row) => row.Created,
      selector: (row) => {
        const timestamp = row.Created;
        if (!timestamp || !timestamp.toDate) return "N/A";

        const dateObj = timestamp.toDate();
        return `${dateObj.toLocaleDateString(
          "en-GB"
        )} ${dateObj.toLocaleTimeString()}`;
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="mr-10 ml-3"
            onClick={() => handleRowClick("PatientInfo")(row)}>
            <BsFillPencilFill className="text-blue-500" size={20} />
          </button>
          <button onClick={() => setDeleteData(row.id)}>
            <BsFillTrashFill className="text-red-500" size={20} />
          </button>
        </div>
      ),
    },
  ];

  // Table Style
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "grey",
        color: "white",
      },
    },

    headCells: {
      style: {
        fontSize: "16px",
        fontWight: "600",
        textTransform: "uppercase",
      },
    },

    cells: {
      style: {
        fontSize: "15px",
        textTransform: "capitalize",
        textAlign: "center",
      },
    },
    rows: {
      style: {
        backgroundColor: "#FFFFFF",
        "&:nth-child(2n)": {
          backgroundColor: "#EEEEEE",
        },
      },
    },
  };

  //Search
  const [search, setSearch] = useState("");

  const filteredData = patientsList.filter(
    (item) =>
      item.lname.toLowerCase().includes(search.toLowerCase()) ||
      item.fname.toLowerCase().includes(search.toLowerCase())
  );

  // Model visible & style
  const [ModelVisible, setModelVisible] = useState(false);

  const customStylesModel = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9999,
    },
    content: {
      width: "80%", // 👈 Change this to your desired width
      maxWidth: "900px", // Optional: max width for larger screens
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      // padding: "0.5rem",
      borderRadius: "8px",
      backgroundColor: "white",
      zIndex: 10000,
    },
  };

  //On Row Click
  const handleRowClick = (itemToDisplay) => (row) => {
    console.log(row);
    window.location.href = `/PatientDashboard?userId=${row.id}&interface=${itemToDisplay}`;
  };
  const [patientId, setPatientId] = useState("");

  const setDeleteData = (patientId) => {
    setPatientId(patientId);
    setOpenDeletePopUp(true);
  };

  const handleDelete = async (docId) => {
    try {
      auth.onAuthStateChanged(async (user) => {
        await deleteDoc(doc(db, "Users", user.uid, "Patients", docId));
        setOpenDeletePopUp(false);
        window.location.reload(false);
      });
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="p-5 mt-16 mb-32 bg-white dark:bg-sky-900 shadow-xs rounded-xl">
      <div className="w-full flex justify-between mb-3 ">
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-900 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="
 block w-full p-2 ps-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:outline-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search For Patient"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        <button
          onClick={() => setModelVisible(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Add New Patient
        </button>
        <Model
          isOpen={ModelVisible}
          onRequestClose={() => setModelVisible(false)}
          style={customStylesModel}
          ariaHideApp={false}>
          <RegisterNewPatient onClick={() => setModelVisible(false)} />
        </Model>
      </div>

      <DataTable
        // title="Patients List"
        columns={columns}
        data={filteredData}
        // fixedHeader
        pagination
        responsive
        highlightOnHover
        customStyles={customStyles}
        pointerOnHover
        onRowClicked={handleRowClick("MainPatientLayout")}
        // expandableRows
        // expandableRowsComponent={ExpandedComponent}
      ></DataTable>

      <DeletePopUp
        open={openDeletePopUp}
        onClose={() => setOpenDeletePopUp(false)}>
        <div className="text-center w-56">
          <BiTrash size={56} className="mx-auto text-red-500" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black text-gray-800">
              {" "}
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to remove this patient from the list ?
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="btn btn-danger w-full"
              onClick={() => handleDelete(patientId)}>
              Delete
            </button>
            <button
              className="btn btn-light w-full"
              onClick={() => setOpenDeletePopUp(false)}>
              Cancel
            </button>
          </div>
        </div>
      </DeletePopUp>
    </div>
  );
};

export default Patients;
