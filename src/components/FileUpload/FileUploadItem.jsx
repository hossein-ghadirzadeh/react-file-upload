import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Remove from "../../icons/remove.png";
import styles from "./FileUpload.module.scss";

const FileUploadItem = ({
  name,
  progress,
  isFailed,
  isLastItem,
  onRemoveFile,
}) => {
  return (
    <>
      <li className={styles["file-item"]}>
        <div
          className={classNames(
            styles["file-item-name"],
            isFailed && styles["file-item-name-error"]
          )}
        >
          <p>{name}</p>
        </div>
        {Number(progress) === 100 && (
          <button
            onClick={() => onRemoveFile(name)}
            className={styles["file-item-remove-button"]}
          >
            <img src={Remove} alt="remove uploaded file icon" />
          </button>
        )}
      </li>
      {!isLastItem && <hr className={styles["file-item-divider"]} />}
    </>
  );
};

FileUploadItem.defaultProps = {
  onRemoveFile: () => {},
  isLastItem: false,
};

FileUploadItem.propTypes = {
  name: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  isFailed: PropTypes.bool.isRequired,
  isLastItem: PropTypes.bool,
  onRemoveFile: PropTypes.func,
};

export default FileUploadItem;
