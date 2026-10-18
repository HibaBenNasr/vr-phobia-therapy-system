import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const EditableField = ({
  label,
  name,
  value = "",
  defaultValue,
  onSave,
  error,
  type = "text",
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleConfirm = () => {
    const isValid = inputValue.trim().length >= 2;
    if (!isValid) {
      setInputValue(defaultValue);

      error();

      return;
    }
    if (inputValue !== value) {
      onSave(name, inputValue);
    }
    setEditing(false);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        readOnly={!editing}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-500 hover:ring-2 hover:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-none dark:hover:ring-2 dark:hover:ring-blue-500 dark:hover:border-blue-500 ${
          !editing ? "text-gray-500 cursor-not-allowed" : ""
        }`}
      />
      <button
        onClick={editing ? handleConfirm : () => setEditing(true)}
        className={`ml-2 px-3 py-1 text-sm rounded ${
          editing
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}>
        {editing ? "Confirm" : "Edit"}
      </button>
    </div>
  );
};

const Profile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [status, setStatus] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "Users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setFormData({ ...snap.data(), email: user.email });
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (field, newValue) => {
    const user = auth.currentUser;
    const userDocRef = doc(db, "Users", user.uid);

    // Field-specific validation
    const isValid = (() => {
      if (!newValue.trim()) return false;

      switch (field) {
        case "firstname":
        case "lastname":
          return /^[a-zA-ZÀ-ÿ\s'-]{2,30}$/.test(newValue); // basic name pattern
        default:
          return true;
      }
    })();

    if (!isValid) {
      handleError;
      return;
    }

    try {
      // Update Firestore
      await updateDoc(userDocRef, { [field]: newValue });
      setFormData((prev) => ({ ...prev, [field]: newValue }));
      setStatus({ type: "success", message: `${field} updated successfully.` });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: `Failed to update ${field}: ${error.message}`,
      });
    }
  };

  const handleError = () => {
    setStatus({
      type: "error",
      message: `Invalid data. Please check your input.`,
    });
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user || !currentPassword || !newPassword) return;

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      setStatus({ type: "success", message: "Password updated successfully." });
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "" });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: error.message });
      setShowPasswordModal(false);
      setPasswordData({ current: "", new: "" });
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        deletePassword
      );
      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, "Users", user.uid)); // delete from Firestore
      await user.delete(); // delete from Firebase Auth

      // Optional: redirect to login or home page
      // navigate("/login");
      setStatus({ type: "success", message: "Account deleted successfully." });
    } catch (error) {
      console.error("Account deletion failed:", error);
      setStatus({ type: "error", message: error.message });
    } finally {
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  useEffect(() => {
    if (status) {
      const timeout = setTimeout(() => setStatus(null), 10000); // 10 seconds
      return () => clearTimeout(timeout); // Clean up if component unmounts or status changes
    }
  }, [status]);

  return (
    <div className="p-5 mt-16 mb-48 bg-white dark:bg-sky-900 shadow-l rounded-xl transition-all duration-300 ">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Profile Settings
      </h2>

      {status && (
        <div
          className={`mb-4 p-2 rounded text-white ${
            status.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
          {status.message}
        </div>
      )}

      <EditableField
        label="First Name"
        name="firstname"
        value={formData.firstname}
        defaultValue={formData.firstname}
        error={handleError}
        onSave={handleSave}
      />

      <EditableField
        label="Last Name"
        name="lastname"
        value={formData.lastname}
        defaultValue={formData.lastname}
        error={handleError}
        onSave={handleSave}
      />

      <br />
      <br />

      <div className="mb-4 flex items-center justify-between gap-4">
        <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-white">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setInputValue(e.target.value)}
          readOnly={true}
          className={`flex-1 p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed`}
        />
        {/* <button
        onClick={editing ? handleConfirm : () => setEditing(true)}
        className={`ml-2 px-3 py-1 text-sm rounded ${
          editing
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}>
        {editing ? "Confirm" : "Edit"}
      </button> */}
      </div>

      <div className="flex justify-end ">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mr-5">
          Change Password
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2">
          Delete Account
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Update Password
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange(passwordData.current, passwordData.new);
              }}>
              <input
                type="password"
                placeholder="Current Password"
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-500 hover:ring-2 hover:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-none dark:hover:ring-2 dark:hover:ring-blue-500 dark:hover:border-blue-500"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current: e.target.value })
                }
                required
              />
              <input
                type="password"
                className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-500 hover:ring-2 hover:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:outline-none dark:hover:ring-2 dark:hover:ring-blue-500 dark:hover:border-blue-500"
                placeholder="New Password"
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                required
              />
              <br />
              <br />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="!bg-green-600 !hover:bg-green-700 !text-white !px-4 !py-2 !rounded">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
              Please enter your password to delete your account. This action is
              irreversible.
            </p>
            <input
              type="password"
              placeholder="Current Password"
              autoComplete="current-password"
              className="mb-3 w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
