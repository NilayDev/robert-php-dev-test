import { useState, useEffect, useCallback, useMemo } from "react";
import AllImages from "../../constants/image";
import { ITableColumn } from "../../interface/table";
import { IPaginationInfo } from "../../interface";
import { Table } from "../../components/common/Table";
import { getTranslationsDataList } from "../../services/Translations.service";
import AddTranslationsModal from "./AddTranslationsModal";

export interface ITranslationsData {
  translation_id: number;
  title: string;
  source_language_id: number;
  source_language: string;
  source_text: string;
  target_language_id: number;
  target_language: string;
  translation_unit_id: number;
  translated_text: string;
  [key: string]: string | number | File | object;
}

const INIT_PAGINATION: IPaginationInfo = {
  total: 0,
  page: 1,
  limit: 10,
};

const Translations = () => {
  const [pagination, setPagination] = useState(INIT_PAGINATION);
  const [translations, setTranslations] = useState<ITranslationsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"add" | "edit" | "">("add");
  const [selectedData, setSelectedData] = useState<ITranslationsData>();

  const columns = useMemo<ITableColumn<ITranslationsData>[]>(() => [
    {
      key: "title",
      header: "Title",
      render: (_, row) => <span>{row?.title}</span>,
    },
    
    { key: "source_language", header: "Source Language", },
    { key: "target_language", header: "Target Language" },
    { key: "source_text", header: "Source Text",className: "max-w-[350px] truncate" },
   
    { key: "translated_text", header: "Translated Text",className: "max-w-[350px] truncate" },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <button
          className="text-blue-500"
          onClick={() => toggleModal("edit", row)}
        >
          <AllImages.editPen className="w-4 h-4" />
        </button>
      ),
    },
  ], []);

  const fetchData = useCallback(async (paginationData = pagination) => {
    setLoading(true);
    setError(null);
    try {
      const { page, limit } = paginationData;
      const params = {
        skip: (page - 1) * limit,
        limit,
      };

      const response = await getTranslationsDataList({ params });

      if (response?.data?.translations) {
        setTranslations(response.data.translations);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total_records || 0,
        }));
      } else {
        setError("No translations found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch translations.");
    } finally {
      setLoading(false);
    }
  }, []);



  const handlePageChange = (newPageData: IPaginationInfo) => {
    setPagination(newPageData);
    fetchData(newPageData);
  };

  useEffect(() => {
    fetchData(INIT_PAGINATION);
  }, [fetchData]);

  const toggleModal = (type: "add" | "edit" | "", data?: ITranslationsData) => {
    setSelectedData(data);
    setAction(type);
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Manage Translation Units</h2>
          <button
            onClick={() => toggleModal("add")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Translation Unit
          </button>
        </div>

        {error && (
          <div className="p-4 text-red-500 text-center">{error}</div>
        )}

        <Table
          columns={columns}
          data={translations}
          isLoading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      {isModalOpen && (
        <AddTranslationsModal
          selectedData={selectedData}
          userAction={action}
          isModalOpen={isModalOpen}
          handleCloseModal={toggleModal}
          refreshData={() => fetchData(pagination)}
        />
      )}
    </>
  );
};

export default Translations;
