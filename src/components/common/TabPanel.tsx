import React from 'react';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => {
  return <>{index === value && children}</>;
};

export default TabPanel;
