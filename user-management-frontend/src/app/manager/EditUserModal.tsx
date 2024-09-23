import React, { useState, useEffect } from 'react';

interface EditUserModalProps {
  user: { id: number; username: string; usertype: string };
  onUserUpdated: (updatedUser: any) => void;
  closeModal: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onUserUpdated, closeModal }) => {
  const [username, setUsername] = useState(user.username);
  const [usertype, setUsertype] = useState(user.usertype);
  const [password, setPassword] = useState(''); // State for password

  useEffect(() => {
    setUsername(user.username);
    setUsertype(user.usertype);
    setPassword(''); // Clear the password field on modal open
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PATCH', // Use PATCH instead of PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          usertype,
          password: password || undefined, // Send password only if not empty
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser = await response.json();
      onUserUpdated(updatedUser);
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username:</label>
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
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to keep current password"
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="usertype" className="block text-gray-700">User Type:</label>
            <select
              id="usertype"
              value={usertype}
              onChange={(e) => setUsertype(e.target.value)}
              required
              className="w-full border rounded p-2 mt-1"
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EXECUTIVE">Executive</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
