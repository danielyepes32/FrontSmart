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
    <div className="flex flex-wrap w-full gap-4 items-center justify-center">
      <Pagination
        classNames={{
          wrapper:"mx-1 my-1.5",
          item: "",
          cursor: "bg-custom-blue w-auto shadow-lg text-white font-bold transition-all duration-300 ease-in-out",
          chevronNext: "transform rotate-180",
        }}
        boundaries={3}
        isDisabled={hasSearchFilter}
        page={page}
        size="lg"
        className="gap-2 space-x-8"
        total={pages}
        variant="bordered"
        onChange={setPage}
        showControls//{`${pages === 0 ? false : true}`}
        showShadow
      />
      {/*console.log(page, pages)*/}
      <span className="text-small text-default-400 text-custom-blue">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${itemsLength} selected`}
      </span>
    </div>
  );
};

export default BottomContent;
