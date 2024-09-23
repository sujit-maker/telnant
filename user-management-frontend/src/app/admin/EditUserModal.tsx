import React, { useState, useEffect } from 'react';

interface EditUserModalProps {
  user: { id: number; username: string; usertype: string; managerId?: number };
  onUserUpdated: (updatedUser: any) => void;
  closeModal: () => void;
  managers: { id: number; username: string }[];
  currentUserType: string | null; // Add this line
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onUserUpdated, closeModal, managers, currentUserType }) => {
  const [username, setUsername] = useState(user.username);
  const [usertype, setUsertype] = useState(user.usertype);
  const [managerId, setManagerId] = useState<number | null>(user.managerId || null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    setUsername(user.username);
    setUsertype(user.usertype);
    setManagerId(user.managerId || null);
  }, [user]);

  const userTypeOptions = currentUserType === 'SUPERADMIN' 
    ? ['ADMIN', 'MANAGER', 'EXECUTIVE'] 
    : ['MANAGER', 'EXECUTIVE'];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, username, usertype, managerId, password };

    const response = await fetch(`http://localhost:8000/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      onUserUpdated(updatedUser);
      closeModal();
    } else {
      console.error('Failed to update user');
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>User Type</label>
          <select value={usertype} onChange={(e) => setUsertype(e.target.value)}>
            {userTypeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {usertype === 'EXECUTIVE' && (
          <div>
            <label>Select Manager</label>
            <select value={managerId || ''} onChange={(e) => setManagerId(Number(e.target.value))}>
              <option value="">Select a manager</option>
              {managers.map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.username}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Update User</button>
        <button type="button" onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUserModal;
