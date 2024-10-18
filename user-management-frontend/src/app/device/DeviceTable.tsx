"use client"
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import CreateDeviceModal from './CreateDeviceModal';
import EditDeviceModal from './EditDeviceModal';
import Header from '../admin/Header';
import { Device } from './types'; // Adjust the path as needed

const DeviceTable: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    setFilteredDevices(
      devices.filter(device =>
        device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.deviceType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, devices]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:8000/devices');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Device[] = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        const response = await fetch(`http://localhost:8000/devices/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchDevices(); 
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const handleDeviceCreated = () => {
    fetchDevices(); 
  };

  const handleDeviceUpdated = (updatedDevice: Device) => {
    setDevices(prev =>
      prev.map(device => (device.id === updatedDevice.id ? updatedDevice : device))
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:pl-72" style={{ marginTop: 80 }}>
      <Header />
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition mb-4 md:mb-0"
        >
          Add Device
        </button>
        <div className="relative mt-4 md:mt-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices..."
            className="pl-8 pr-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>
      <div className="overflow-x-auto ml-8">
        <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg ml-10">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-1 text-xs md:text-sm">Device ID</th>
              <th className="border p-1 text-xs md:text-sm">Device Name</th>
              <th className="border p-1 text-xs md:text-sm">Device Type</th>
              <th className="border p-1 text-xs md:text-sm">Device IP</th>
              <th className="border p-1 text-xs md:text-sm">Device Port</th>
              <th className="border p-1 text-xs md:text-sm">Username</th>
              <th className="border p-1 text-xs md:text-sm">Password</th>
              <th className="border p-1 text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id}>
                <td className="border p-1">{device.deviceId}</td>
                <td className="border p-1">{device.deviceName}</td>
                <td className="border p-1">{device.deviceType}</td>
                <td className="border p-1">{device.deviceIp}</td>
                <td className="border p-1">{device.devicePort}</td>
                <td className="border p-1">{device.deviceUsername}</td>
                <td className="border p-1">{device.devicePassword}</td>
                <td className="border p-1 text-center">
                  <button onClick={() => handleEdit(device)} className="text-blue-500 hover:text-blue-700 mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(device.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCreateModalOpen && (
        <CreateDeviceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onDeviceCreated={handleDeviceCreated}
        />
      )}
      {isEditModalOpen && selectedDevice && (
        <EditDeviceModal
          device={selectedDevice}
          onDeviceUpdated={handleDeviceUpdated}
          closeModal={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DeviceTable;
