import React, { useMemo, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { generateRandomId } from "../../utils/string";
import FileUploadItem from "./FileUploadItem";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import styles from "./FileUpload.module.scss";

export const updateStatus = (key, value) => {
  return {
    uploading: false,
    done: false,
    failed: false,
    partialDone: false,
    [key]: value,
  };
};

const FileUpload = ({
  as: Component,
  id,
  label,
  error,
  errorMessage,
  helperText,
  dragDropMessage,
  fileSelectMessage,
  onUploadFiles,
  uploadedFiles,
  onRemoveFile,
}) => {
  const fileUploadRef = useRef();

  const inputId = useMemo(() => id || generateRandomId(), [id]);

  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    done: false,
    failed: false,
    partialDone: false,
  });
  const [uploadedMessage, setUploadedMessage] = useState("");

  useEffect(() => {
    const uFilesLength = uploadedFiles.length;
    let _isUploading = false;

    for (let i = 0; i < uFilesLength; i += 1) {
      if (uploadedFiles[i].progress < 100) {
        _isUploading = true;
      }
    }

    setUploadStatus(updateStatus("uploading", _isUploading));

    if (!_isUploading) {
      const uploadFailed = [];
      const uploadDone = [];
      for (let i = 0; i < uFilesLength; i += 1) {
        if (uploadedFiles[i].isFailed) {
          uploadFailed.push(i);
        } else {
          uploadDone.push(i);
        }
      }

      if (uploadFailed.length === uFilesLength) {
        setUploadStatus(updateStatus("failed", true));
        setUploadedMessage("Upload failed");
      } else if (uploadDone.length === uFilesLength) {
        setUploadStatus(updateStatus("done", true));
        setUploadedMessage(
          `${uploadDone.length} ${
            uploadDone.length > 1 ? "files" : "file"
          } uploaded`
        );
      } else {
        setUploadStatus(updateStatus("partialDone", true));
        setUploadedMessage(
          `${uploadFailed.length} ${
            uploadFailed.length > 1 ? "uploads" : "upload"
          } failed`
        );
      }
    }
  }, [uploadedFiles]);

  const { dragOver, setDragOver, onDragOver, onDragLeave } = useDragAndDrop();

  const onDropHandler = (e) => {
    e.preventDefault();
    setDragOver(false);
    const filesObj = {};
    Object.values(e.dataTransfer.files).forEach((item) => {
      const { name } = item;
      filesObj[name] = item;
    });
    onUploadFiles(filesObj);
  };

  const onSelectHandler = (e) => {
    const filesObj = {};
    Object.values(e.target.files).forEach((item) => {
      const { name } = item;
      filesObj[name] = item;
    });
    onUploadFiles(filesObj);
  };

  return (
    <Component className={classNames(error && styles.error)}>
      {error && (
        <div className={styles["error-section"]}>
          <div className={styles["error-icon"]} />
          <p className={styles["error-message"]}>{errorMessage}</p>
        </div>
      )}

      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        ref={fileUploadRef}
        type="file"
        id={inputId}
        multiple
        className={styles["input-file"]}
        onChange={onSelectHandler}
        onClick={(e) => {
          e.target.value = null;
        }}
      />

      {uploadedFiles.length === 0 && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDropHandler}
          className={classNames(
            styles["input-file-box"],
            dragOver && styles["drag-over"]
          )}
        >
          <p className={styles["drag-drop-message"]}>{dragDropMessage}</p>
          {fileSelectMessage && <>&nbsp;</>}
          <input
            type="button"
            value={fileSelectMessage}
            className={styles["select-file-message"]}
            onClick={() => fileUploadRef.current.click()}
          />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div
          className={classNames(
            styles["upload-box"],
            uploadStatus.uploading && styles["upload-box-uploading"],
            uploadStatus.failed && styles["upload-box-error"],
            uploadStatus.done && styles["upload-box-done"],
            uploadStatus.partialDone && styles["upload-box-partial-done"]
          )}
        >
          {uploadStatus.uploading ? (
            <p className={styles["upload-message"]}>
              {`Uploading ${uploadedFiles.length} files...`}
            </p>
          ) : (
            <div className={styles["uploaded-message"]}>
              <div
                className={classNames(
                  styles["uploaded-status-message"],
                  uploadStatus.done && styles["uploaded-done-message"]
                )}
              >
                <span>{uploadedMessage}</span>
              </div>
              <div className={styles["upload-more-button"]}>
                <input
                  id="test-upload-more-button"
                  type="button"
                  value="Upload more files"
                  onClick={() => fileUploadRef.current.click()}
                />
              </div>
            </div>
          )}

          <ul className={styles["upload-items-list"]}>
            {uploadedFiles.map(({ name, progress, isFailed }, fileIndex) => (
              <FileUploadItem
                key={name}
                name={name}
                progress={progress}
                isFailed={isFailed}
                isLastItem={uploadedFiles.length - 1 === fileIndex}
                onRemoveFile={onRemoveFile}
              />
            ))}
          </ul>
        </div>
      )}

      <p className={classNames(styles["helper-text"])} variant="paragraph-sm">
        {helperText}
      </p>
    </Component>
  );
};

FileUpload.defaultProps = {
  auid: "",
  as: "div",
  id: "",
  label: "Label",
  error: false,
  errorMessage: "Error Label",
  helperText: "Helper Message",
  dragDropMessage: "Drag files here or",
  fileSelectMessage: "choose from a folder",
  uploadedFiles: [],
  onRemoveFile: () => {},
};

FileUpload.propTypes = {
  /**
   * An id for automation tests.
   */
  auid: PropTypes.string,
  /**
   * The html element to be rendered.
   */
  as: PropTypes.string,
  /**
   * Id of the component, needed for properly functioning.
   * If no Id is provided, a random Id is generated
   */
  id: PropTypes.string,
  /**
   * Label for FileUpload component
   */
  label: PropTypes.string,
  /**
   * Helper text
   */
  helperText: PropTypes.string,
  /**
   * Input drag and drop text
   */
  dragDropMessage: PropTypes.string,
  /**
   * Input select file(s) text
   */
  fileSelectMessage: PropTypes.string,
  /**
   * If 'true', display error message
   */
  error: PropTypes.bool,
  /**
   * Message to be displayed when error is set to 'true'
   */
  errorMessage: PropTypes.string,
  /**
   * Callback to be called when select or drop file(s).
   *
   * Parameters:
   *
   * @param {object} files - object indicating the pair of name and value of each file
   *  `name` - name of the file,
   *  `value` - file information
   */
  onUploadFiles: PropTypes.func.isRequired,
  /**
   * Array of objects indicating the status of uploading the file
   *  `name` - name of the file,
   *  `progress` - uploading file progress,
   *  `isFailed` - does the uploading file faced with an error.
   */
  uploadedFiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      progress: PropTypes.number,
      isFailed: PropTypes.bool,
    })
  ),
  /**
   * Callback to be called when you want to delete uploaded file.
   *
   * Parameters:
   *
   * @param {string} name - String containing the `name` of the file to be removed.
   */
  onRemoveFile: PropTypes.func,
};

export default FileUpload;
