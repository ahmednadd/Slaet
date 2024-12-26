import React, { useContext, useState } from "react";
import "./TaskEdit.scss";
import TimeSelector from "../TimeSelector/TimeSelector";
import { Icons } from "../../utils/icons";
import Button from "../Button/Button";
import { TodoContext } from "../../context/TodoContext";
import DeleteDropdown from "../DeleteDropdown/DeleteDropdown";

const TaskEdit = () => {
  const { state, setState } = useContext(TodoContext);
  const [showDelete, setShowDelete] = useState(false);
  const { selectedTask } = state;
  const closeEdit = () => {
    setState((prevState) => ({
      ...prevState,
      selectedTask: null,
    }));
  };

  return (
    <div className="task-edit-container">
      <div className="task-edit-container-options">
        <Icons.dots onClick={() => setShowDelete(true)} />
        <Icons.close onClick={closeEdit} />
        {showDelete && <DeleteDropdown />}
      </div>
      <div className="task-edit-container-task">
        <span className="heading">{selectedTask?.title}</span>
        <div className="complete">
          <input type="checkbox" checked={selectedTask?.isCompleted} />
          <span>Mark as complete</span>
        </div>
      </div>
      <div className="divider" />
      <div className="task-edit-container-time">
        <Icons.timeLine />
        <TimeSelector />
      </div>

      <div className="task-edit-container-time">
        <Icons.calendar />
        <span>05 Dec, Wed</span>
      </div>
      <div className="task-edit-container-time">
        <Icons.repeat />
        <span>Everyday</span>
      </div>

      <div className="task-edit-container-time notification">
        <Icons.notification />
        <span>Remind me:</span>
      </div>
      <div className="btn">
        <Button />
      </div>
    </div>
  );
};

export default TaskEdit;
