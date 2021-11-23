import React from 'react';
import Task from './Task';

const TaskList = ({ todos }) => (
  <ul className="todo-list">
    {todos.map((item) => (
      <Task key={item.id} {...item} />
    ))}
  </ul>
);

export default TaskList;
