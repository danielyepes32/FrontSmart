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
  console.log("keys: ",selectedKeys)
  return (
    <div className="flex flex-wrap w-full gap-4 items-center justify-center">
      <Pagination
        classNames={{
          cursor: "bg-custom-blue text-white"
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
      {console.log(page, pages)}
    </div>
  );
};

export default BottomContent;
