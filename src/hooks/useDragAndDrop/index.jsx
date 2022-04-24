import { useState } from "react";

const useDragAndDrop = () => {
  const [dragOver, setDragOver] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return {
    dragOver,
    setDragOver,
    onDragOver,
    onDragLeave,
  };
};

export default useDragAndDrop;
