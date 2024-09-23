// This file will render the Dashboard page at /admin/dashboard
import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

const dashboard: React.FC = () => {
  return (
    <>
    <Header/>
    <Sidebar/>
    </>
  );
};

export default dashboard;
