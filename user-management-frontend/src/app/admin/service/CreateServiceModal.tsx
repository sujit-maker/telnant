import React, { useState } from 'react';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreated: () => void;
}

const CreateServiceModal: React.FC<CreateServiceModalProps> = ({ isOpen, onClose, onServiceCreated }) => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceName, description }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      onServiceCreated(); // Refresh the service list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded shadow mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default CreateServiceModal;
