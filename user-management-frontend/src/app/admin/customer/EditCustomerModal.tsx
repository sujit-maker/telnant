import React, { useState } from 'react';
import { Customer } from './types'; // Adjust path as needed

interface EditCustomerModalProps {
  customer: Customer;
  onCustomerUpdated: (customer: Customer) => void;
  closeModal: () => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer, onCustomerUpdated, closeModal }) => {
  const [updatedCustomer, setUpdatedCustomer] = useState<Customer>(customer);

  // Handle input changes for customer fields
  const handleInputChange = (field: keyof Customer, value: string) => {
    setUpdatedCustomer(prev => ({ ...prev, [field]: value }));
  };

  // Handle saving the updated customer
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/customers/${updatedCustomer.id}`, { // Ensure 'id' is correct
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedData = await response.json(); // Handle response if needed
      onCustomerUpdated(updatedData); // Notify parent component of update
      closeModal(); // Close the modal
    } catch (error) {
      console.error('Failed to update customer:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80 max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={updatedCustomer.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Customer Address</label>
          <textarea
            value={updatedCustomer.customerAddress}
            onChange={(e) => handleInputChange('customerAddress', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">GST Number</label>
          <input
            type="text"
            value={updatedCustomer.gstNumber}
            onChange={(e) => handleInputChange('gstNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contact Name</label>
          <input
            type="text"
            value={updatedCustomer.contactName}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="text"
            value={updatedCustomer.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={updatedCustomer.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
