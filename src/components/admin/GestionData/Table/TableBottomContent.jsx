import React from "react";
import { Pagination } from "@nextui-org/react";

const BottomContent = ({
  page,
  setPage,
  pages,
}) => {
  return (
    <div className="flex h-full w-full place-items-center items-center justify-center">
      <Pagination
        classNames={{
          wrapper:"mx-1 h-full",
          item: "w-auto",
          cursor: "bg-custom-blue w-auto shadow-lg text-white font-bold transition-all duration-300 ease-in-out",
        }}
        boundaries={3}
        //isDisabled={hasSearchFilter}
        page={page}
        size="lg"
        className="space-x-8"
        total={pages}
        variant="bordered"
        onChange={setPage}
        showControls//{`${pages === 0 ? false : true}`}
        showShadow
      />
      {console.log(page, pages)}
    </div>
  );
};

export default BottomContent;
