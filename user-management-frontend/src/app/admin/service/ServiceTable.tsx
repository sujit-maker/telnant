  "use client"
  import React, { useEffect, useState } from 'react';
  import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
  import CreateServiceModal from './CreateServiceModal';
  import EditServiceModal from './EditServiceModal';
  import Header from '../Header';
  import { Service } from './types'; // Adjust path as needed

  const ServiceTable: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
      fetchServices();
    }, []);

    useEffect(() => {
      setFilteredServices(
        services.filter(service =>
          service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.serviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, [searchQuery, services]);

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8000/services');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Service[] = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    const handleDelete = async (id: number) => { // Ensure this matches your serviceId type
      if (window.confirm("Are you sure you want to delete this service?")) { // Add confirmation dialog
        try {
          const response = await fetch(`http://localhost:8000/services/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          // Refresh the service list after successful deletion
          fetchServices(); 
        } catch (error) {
          console.error('Failed to delete service:', error);
        }
      }
    };
    

    const handleEdit = (service: Service) => {
      setSelectedService(service);
      setIsEditModalOpen(true);
    };

    const handleServiceCreated = () => {
      fetchServices(); // Refresh the service list after creating a new service
    };

    const handleServiceUpdated = (updatedService: Service) => {
      setServices(prev =>
        prev.map(service => (service.id === updatedService.id ? updatedService : service))
      );
    };

    return (
      <div className="container mx-auto px-4 py-6" style={{ width: 1000, marginTop: 80, marginLeft: "350px" }}>
        <Header />
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
          >
            Add Service
          </button>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr>
              {/* <th className="border p-3">Id</th> */}
              <th className="border p-3">Service ID</th>
              <th className="border p-3">Service Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                {/* <td className="border p-3">{service.id}</td> */}
                <td className="border p-3">{service.serviceId}</td>    
                <td className="border p-3">{service.serviceName}</td>
                <td className="border p-3">{service.description}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)} // Use id here
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
          <CreateServiceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onServiceCreated={handleServiceCreated}
          />
        )}
        {isEditModalOpen && selectedService && (
          <EditServiceModal
            service={selectedService}
            onServiceUpdated={handleServiceUpdated}
            closeModal={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
    );
  };

  export default ServiceTable;
