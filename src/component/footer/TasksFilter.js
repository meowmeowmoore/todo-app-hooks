import React, { useContext } from 'react';
import MyContext from '../Context';

const TasksFilter = ({ value, selected }) => {
  const { clickFilter } = useContext(MyContext);

  let classNames = '';
  if (selected) {
    classNames += 'selected';
  }

  return (
    <button type="button" className={classNames} onClick={() => clickFilter(value)}>
      {value}
    </button>
  );
};

export default TasksFilter;
