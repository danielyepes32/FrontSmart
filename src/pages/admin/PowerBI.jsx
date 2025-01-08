import React from 'react';
import { Pagination } from '@nextui-org/react';

const PowerView = (sidebar) => {

  return (
    <div className={`p-4 bg-gray-200 lg:h-screen h-screen flex flex-col col-span-6 block`}>
      <iframe
           src="https://app.powerbi.com/view?r=eyJrIjoiYmMzYjI0YzYtYzgwNS00MTFhLWE2NmEtYWMzMThjNmJiYzdjIiwidCI6IjkzMDQ2ZDA5LTgzODQtNDJmNC04MjNiLTNhZWQ3NTVjMmI3MSIsImMiOjR9&pageName=757459c0870cc00c9db5"
          title="FinalInformeSmart"
          className='rounded-[20px] h-full'
      />
    </div>
  );
};

export default PowerView;
