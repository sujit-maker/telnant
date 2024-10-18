import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  currentUserType: string | null;
  adminId: number | null; // Ensure adminId is of type `number`
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  currentUserType,
  adminId,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("EXECUTIVE");
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState<{ id: number; username: string }[]>(
    []
  );

  // Fetch managers based on adminId when the modal opens
  useEffect(() => {
    const fetchManagers = async () => {
      if (adminId) {
        try {
          const response = await fetch(
            `http://localhost:8000/users/managers?adminId=${adminId}`
          );
          const data = await response.json();
          if (response.ok) {
            setManagers(data); // Assuming the response is an array of managers
          } else {
            setError(data.message || "Failed to fetch managers.");
          }
        } catch (err) {
          setError("An unexpected error occurred while fetching managers.");
        }
      }
    };

    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen, adminId]);

  const userTypeOptions =
    currentUserType === "SUPERADMIN"
      ? ["ADMIN", "MANAGER", "EXECUTIVE", "SUPERADMIN"]
      : ["MANAGER", "EXECUTIVE"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usertype === "EXECUTIVE" && selectedManagerId === null) {
      setError("Please select a valid manager.");
      return;
    }

    const payload = {
      username,
      password,
      usertype,
      managerId: usertype === "EXECUTIVE" ? selectedManagerId : null,
      adminId, // Store adminId directly from the prop
    };

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("User created successfully!"); // Set success message
        setError(null);
        onUserCreated();
        resetForm();
        // Close modal after a delay
        setTimeout(() => {
          onClose();
          setSuccess(null); // Reset success message after closing
        }, 2000);
      } else if (data.message === "User already exists") {
        setError("User already exists. Please choose another username.");
        setSuccess(null);
      } else {
        setError(data.message || "An error occurred while creating the user.");
        setSuccess(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setUsertype("EXECUTIVE");
    setSelectedManagerId(null);
  };

  const handleManagerSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedManagerId = Number(e.target.value);
    setSelectedManagerId(selectedManagerId);
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-[9999]"
        aria-labelledby="create-user-title"
        aria-describedby="create-user-description"
      >
        <Dialog.Panel className="max-w-sm w-full bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title
            id="create-user-title"
            className="text-xl font-semibold mb-4"
          >
            Create User
          </Dialog.Title>
          {error && (
            <div
              className="bg-red-100 text-red-700 p-2 rounded mb-4"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="bg-green-100 text-green-700 p-2 rounded mb-4"
              role="alert"
              aria-live="assertive"
            >
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="usertype" className="block text-gray-700">
                User Type
              </label>
              <select
                id="usertype"
                value={usertype}
                onChange={(e) => setUsertype(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                {userTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {usertype === "EXECUTIVE" && (
              <div className="mb-4">
                <label htmlFor="manager" className="block text-gray-700">
                  Select Manager
                </label>
                <select
                  id="manager"
                  value={selectedManagerId || ""}
                  onChange={handleManagerSelection}
                  className="w-full border rounded p-2 mt-1"
                  required
                >
                  <option value="">--Select Manager--</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-300 text-black rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white rounded px-4 py-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};

export default CreateUserModal;
