import axios from "../api/axios";
import mime from "mime-types";

export const useDownloadFile = () => {
  const downloadFile = async (fileVersionId: string, filename: string) => {
    try {
      const response = await axios.get(`content/download/${fileVersionId}`, {
        responseType: "blob",
      });

      // Extract the Content-Type header
      const contentType = response.headers["content-type"];
      const fileExtension = mime.extension(contentType) || "file";

      // Append the correct file extension to the filename
      const finalFilename = `${filename}.${fileExtension}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalFilename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert("Failed to download the file. " + error.message);
    }
  };

  return { downloadFile };
};
