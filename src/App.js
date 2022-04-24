import React, { useState } from "react";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [uploadedFilesData, setUploadedFilesData] = useState([]);
  const handleOnUploadFiles = (files) => {
    if (uploadedFilesData.length > 0) {
      const newUploadedFiles = [...uploadedFilesData];
      Object.keys(files).forEach((fileName) => {
        newUploadedFiles.push({
          name: fileName,
          progress: 100,
          isFailed: false,
        });
      });
      setUploadedFilesData(newUploadedFiles);
    } else {
      const newUploadedFiles = Object.keys(files).map((fileName) => {
        return {
          name: fileName,
          progress: 100,
          isFailed: false,
        };
      });
      setUploadedFilesData(newUploadedFiles);
    }
  };
  const handleOnRemoveFile = (fileName) => {
    const uploadedFiles = [...uploadedFilesData];
    const filteredFiles = uploadedFiles.filter(
      (file) => file.name !== fileName
    );
    setUploadedFilesData(filteredFiles);
  };
  return (
    <div>
      <FileUpload
        onUploadFiles={handleOnUploadFiles}
        uploadedFiles={uploadedFilesData}
        onRemoveFile={handleOnRemoveFile}
        error={false}
      />
    </div>
  );
};

export default App;
