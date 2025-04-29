import { useCallback, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldError, FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";

import { generateValidationSchema } from "../../utils";
import { createTranslations, getLanguagesDataList, updateTranslations } from "../../services/Translations.service";
import { addTranslationsFieldConfigs,editTranslationsFieldConfigs } from "./Translations.validation";
import { ITranslationsData } from "./Translations";
import RenderField from "../../components/render-fields/RenderFields";

export interface IFormInput {
  title?: string;
  source_language_id?: string;
  target_language_id?: string;
  content ?: File;
}

interface IUserFormInput {
  [key: string]: any;
}

const AddTranslationsModal = ({
  selectedData,
  userAction,
  isModalOpen,
  handleCloseModal,
  refreshData,
}: {
  selectedData?: ITranslationsData;
  userAction: string;
  isModalOpen: boolean;
  handleCloseModal: (action: 'add' | 'edit' | "") => void;
  refreshData: () => void;
}) => {
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const validationSchema = useMemo(
    () => generateValidationSchema(userAction === "add" ? addTranslationsFieldConfigs:editTranslationsFieldConfigs),
    []
  );

  const methods = useForm<IUserFormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues: userAction === "edit" ? {title:selectedData?.title,source_language_id:selectedData?.source_language_id,target_language_id:selectedData?.target_language_id,content:selectedData?.source_text} : {},
  });

  const { handleSubmit, reset,register,formState:{errors},watch,setError,setValue } = methods;

  const registerField = (fieldName: keyof IFormInput, config: {
    type: string;
    required: string;
    label: string;
    isDropdown: boolean;
    isFile?: boolean;
    placeholder: string;
  }) => {
    if (config.isFile) {
      return register(fieldName, {
        validate: (files) => files?.length > 0 || `${config.label || fieldName} is required`,
      });
    }
  
    return register(fieldName, {
      required: config.required,
    });
  };

  const getLanguages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getLanguagesDataList();
      setLanguages(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch Languages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      getLanguages();
    }
  }, [getLanguages, isModalOpen]);

  const onSubmit: SubmitHandler<IUserFormInput> = async (data:IFormInput) => {
    console.log("data:",data)
    try {
      setIsApiLoading(true);
      const formData = new FormData();

      for (const key in data) {
        if (data[key as keyof IFormInput] instanceof File) {
          console.log("file:",key)
          formData.append(key, data[key as keyof IFormInput] || "");
        } else if(key !== "content") {
          formData.append(key, data[key as keyof IFormInput] || "");
        }
      }

      Object.entries(data.content as object).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(`content`, value); // File goes directly
        } 
      });

      if (userAction === "add") {
        await createTranslations({ data: formData });
      } else if (userAction === "edit") {
        formData.append('translation_unit_id', selectedData?.translation_unit_id.toString() || "");
    
          formData.append(`content`, data.content || "");
        
        await updateTranslations(selectedData?.translation_id || 0, {
          params: { id: selectedData?.id },
          data: formData,
        });
      }

       refreshData();
       reset();
       handleCloseModal("");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => handleCloseModal("")}>
      <FormProvider {...methods}>
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-2xl font-bold">
              {userAction === "add" ? "Add" : "Update"} Translation Unit
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="block w-full space-y-4">
            {(Object.keys(userAction === "add" ? addTranslationsFieldConfigs: editTranslationsFieldConfigs) as Array<keyof IFormInput>).map(
              (field) => (
                <RenderField
                  key={field}
                  fieldKey={field}
                  config={userAction === "add" ?addTranslationsFieldConfigs[field] : editTranslationsFieldConfigs[field]}
                  registerProps={registerField(field, userAction === "add" ?addTranslationsFieldConfigs[field]:editTranslationsFieldConfigs[field])}
                  error={errors[field] as FieldError}
                  value={watch(field)}
                  options={languages}
                  setError={setError}
                  setValue={setValue}
                  isDisabled={userAction === "edit" && field !== "content"}
                />
              )
            )}
          </form>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button
              label={userAction === "add" ? "Save" : "Update"}
              variant="primary"
              classes="px-4 py-2 rounded-lg"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || isApiLoading}
            />
            <Button
              label="Close"
              variant="gray"
              classes="px-4 py-2 rounded-lg"
              onClick={() => handleCloseModal("")}
            />
          </div>
        </div>
      </FormProvider>
    </Modal>
  );
};

export default AddTranslationsModal;
