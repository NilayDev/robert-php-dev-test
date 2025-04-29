import React, { useEffect, useState } from "react";

import AllImages from "../../constants/image";
import { ITableData, ITableProps } from "../../interface/table";

export const Table = <T extends ITableData>({
  columns,
  data,
  onSort,
  isLoading = false,
  pagination,
  onPageChange,
}: ITableProps<T>): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);

  const { page, limit, total } = pagination || {
    page: currentPage,
    limit: 5,
    total: data.length,
  };
  const totalPages = Math.ceil(total / limit);
  const [defaultCurrentData, setDefaultCurrentData] = useState(
    pagination?.total
      ? data
      : data.slice((currentPage - 1) * limit, currentPage * limit)
  );

  useEffect(() => {
    setDefaultCurrentData(
      pagination?.total
        ? data
        : data.slice((currentPage - 1) * limit, currentPage * limit)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, data]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange({
        total: pagination?.total || Math.ceil(data.length / 5),
        page: page,
        limit: pagination?.limit || 5,
      });
    } else {
      setCurrentPage(page);
      setDefaultCurrentData(data.slice((page - 1) * limit, page * limit));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-[calc(100dvh-162px)] border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#D9D9D9]/50 sticky top-0 z-10 shadow-sm backdrop-blur-md">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={String(i)}
                  className={`px-6 py-3 text-left text-sm font-medium text-black tracking-wider ${column.className || ""}`}
                  onClick={() => onSort && onSort(column.key)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {defaultCurrentData?.length ? (
              defaultCurrentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-black ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(
                            row[column.key as keyof T] as string,
                            row
                          )
                        : (row[column.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="h-[50vh] md:h-[71vh] lg:h-[50vh]">
                <td colSpan={columns.length} className="text-center py-6">
                  <div className="flex justify-center items-center flex-col gap-4">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
                    ) : (
                      <>
                        <p className="text-base font-bold">{`No data found`}</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Integrated Pagination */}
      {totalPages > 1 && (
  <div className="flex items-center justify-end space-x-2 mt-4 flex-wrap">
    <button
      onClick={() => handlePageChange(page - 1)}
      disabled={page === 1}
      className="bg-white py-2 px-2.5 rounded-md border disabled:opacity-50"
    >
      <AllImages.arrowLeft />
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((pageNumber) => {
        return (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          (pageNumber >= page - 1 && pageNumber <= page + 1)
        );
      })
      .reduce((acc: (number | "...")[], current, index, array) => {
        if (index === 0 || current - (array[index - 1] as number) === 1) {
          acc.push(current);
        } else {
          acc.push("...", current);
        }
        return acc;
      }, [])
      .map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`w-8 h-8 rounded-md ${
              page === item
                ? "bg-blue-500 text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
        )
      )}

    <button
      onClick={() => handlePageChange(page + 1)}
      disabled={page === totalPages}
      className="bg-white py-2 px-2.5 rounded-md border disabled:opacity-50"
    >
      <AllImages.arrowRight />
    </button>
  </div>
)}

    </div>
  );
};
