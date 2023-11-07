import React from "react";
const ComponentLayout = ({ children }: any) => {
  return (
    <div className="ml-5 bg-white rounded-lg h-[calc(100vh-32px)] flex-1">
      {children}
    </div>
  );
};

export default ComponentLayout;
