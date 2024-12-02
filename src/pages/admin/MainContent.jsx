import React from 'react';
import { Pagination } from '@nextui-org/react';

const MainContent = (sidebar) => {

  return (
    <div className={`p-4 bg-gray-200 lg:h-screen h-screen flex flex-col col-span-6 block`}>
      <iframe
          src="http://localhost:8080/dags/WF_MAIN/grid?tab=details&task_id=start_dag&lang=es"
          title="External View"
          className='rounded-[20px] h-full'
      />
    </div>
  );
};

export default MainContent;
