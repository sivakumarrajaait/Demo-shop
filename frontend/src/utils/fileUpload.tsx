import axios from "axios";


export const uploadSingleFile = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file); 

    const response = await axios.post(
      "http://localhost:5000/api/upload/singleupload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data?.fileUrl || null; 
  } catch (error) {
    console.error("Single file upload failed:", error);
    return null;
  }
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[] | null> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); 
    });

    const response = await axios.post(
      "http://localhost:5000/api/upload/multipleUpload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data?.fileUrls || null; 
  } catch (error) {
    console.error("Multiple file upload failed:", error);
    return null;
  }
};
