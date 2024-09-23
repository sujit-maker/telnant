// SiteTable.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import CreateSiteModal from './CreateSiteModal';
import EditSiteModal from './EditSiteModal';
import { Customer, Site } from './types'; // Adjust path as needed

const SiteTable: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchSites();
    fetchCustomers(); // Fetch customers on component mount
  }, []);

  useEffect(() => {
    // Filter sites based on the search query
    setFilteredSites(
      sites.filter(site =>
        site.siteName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, sites]);

  const fetchSites = async () => {
    try {
      const response = await fetch('http://localhost:8000/site');
      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }
      const data: Site[] = await response.json();
      setSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSiteCreated = (site: Site) => {
    setSites(prevSites => [...prevSites, site]);
    fetchSites(); // Ensure the latest data is fetched
  };

  const handleSiteUpdated = (updatedSite: Site) => {
    setSites(prevSites =>
      prevSites.map(site => (site.id === updatedSite.id ? updatedSite : site))
    );
    setEditingSite(null); // Close the edit modal
    fetchSites(); // Ensure the latest data is fetched
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/site/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete site');
      }
      setSites(prevSites => prevSites.filter(site => site.id !== id));
      fetchSites(); // Ensure the latest data is fetched
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6" style={{ width: 1000, marginTop: 80, marginLeft: '350px' }}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Add Site
        </button>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sites..."
            className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Site Name</th>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Contact Name</th>
            <th className="py-2 px-4 border-b">Contact Number</th>
            <th className="py-2 px-4 border-b">Contact Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSites.map(site => (
            <tr key={site.id}>
              <td className="py-2 px-4 border-b">{site.siteName}</td>
              <td className="py-2 px-4 border-b">{site.customer ? site.customer.customerName : 'N/A'}</td>
              <td className="py-2 px-4 border-b">{site.siteAddress}</td>
              <td className="py-2 px-4 border-b">{site.contactName}</td>
              <td className="py-2 px-4 border-b">{site.contactNumber}</td>
              <td className="py-2 px-4 border-b">{site.contactEmail}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => setEditingSite(site)}
                  className="text-yellow-500 hover:text-yellow-700 mr-2"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CreateSiteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSiteCreated={handleSiteCreated}
        fetchSites={fetchSites} // Pass the fetch function to the modal
      />

      {editingSite && (
        <EditSiteModal
          isOpen={!!editingSite}
          site={editingSite}
          customers={customers}
          onSiteUpdated={handleSiteUpdated}
          closeModal={() => setEditingSite(null)}
          fetchSites={fetchSites} // Pass the fetch function to the modal
        />
      )}
    </div>
  );
};

export default SiteTable;
