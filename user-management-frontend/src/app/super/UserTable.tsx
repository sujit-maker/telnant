"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import Header from "../admin/Header";

interface Manager {
  id: number;
  username: string; // This is used for display
}

interface User {
  id: number;
  username: string;
  usertype: string;
  managerId?: number;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchManagerId(); // Fetch managers to use in modals
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: User[] = await response.json();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchManagerId = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/managers');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Manager[] = await response.json();
      console.log('Fetched managers:', data);
      setManagers(data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (username === "admin") {
      alert("SuperAdmin user cannot be deleted!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchUsers(); // Refresh users after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };
  

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    handleCloseEditModal();
  };

  const getManagerName = (managerId?: number) => {
    if (!managerId) return "N/A"; // If no managerId, return N/A
    const manager = managers.find((mgr) => mgr.id === managerId); // Find the manager by id
    return manager ? manager.username : "N/A"; // Return manager's name or N/A if not found
  };
  
  return (
    <>
      <Header />
      <div
        className="container mx-auto px-4 py-6"
        style={{ width: 1000, marginTop: 80, marginLeft: "350px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Add User
          </button>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
          </div>
        </div>
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              <th className="border p-3">Id</th>
              <th className="border p-3">Username</th>
              <th className="border p-3">User Type</th>
              <th className="border p-3">Manager Name</th> 
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="border p-3">{user.id}</td>
                <td className="border p-3">{user.username}</td>
                <td className="border p-3">{user.usertype}</td>
                <td className="border p-3">
                  {user.usertype === "EXECUTIVE" ? getManagerName(user.managerId) : "N/A"}
                </td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                   onClick={() => handleDelete(user.id, user.username)}
                   className="text-red-500 hover:text-red-700"
                 >
                   <FaTrash />
                 </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isCreateModalOpen && (
          <CreateUserModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onUserCreated={fetchUsers}
            managers={managers} // Pass managers here
          />
        )}
        {isEditModalOpen && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
            closeModal={handleCloseEditModal}
            managers={managers} // Pass managers here
          />
        )}
      </div>
    </>
  );
  };

export default UserTable;
