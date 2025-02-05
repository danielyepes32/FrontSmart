import React from "react";
import { Pagination } from "@nextui-org/react";

const BottomContent = ({
  page,
  setPage,
  pages,
  selectedKeys,
  itemsLength,
  hasSearchFilter
}) => {
  //console.log("keys: ",selectedKeys)
  return (
    <div className="flex border-t-2 flex-wrap w-full h-auto mt-auto pt-4 gap-4 items-end justify-center">
      <Pagination
        classNames={{
          wrapper:"mx-1 my-1.5",
          item: "w-auto",
          cursor: "bg-custom-blue w-auto shadow-lg text-white font-bold transition-all duration-300 ease-in-out",
          chevronNext: "transform rotate-180",
        }}
        boundaries={3}
        page={page}
        size="lg"
        className="gap-2 space-x-8 "
        total={pages}
        variant="bordered"
        onChange={setPage}
        showControls//{`${pages === 0 ? false : true}`}
        showShadow
      />
      {/*console.log(page, pages)*/}
      <div className="pb-[2vh]">
        <span className="text-small text-default-400 text-custom-blue">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${itemsLength} selected`}
        </span>
      </div>
    </div>
  );
};

export default BottomContent;
