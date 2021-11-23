import React, { useContext } from 'react';
import TasksFilter from './TasksFilter';
import MyContext from '../Context';

const Footer = ({ buttons, todos }) => {
  const { clearCompleted } = useContext(MyContext);

  const counter = todos.filter((item) => !item.complete).length;
  const todoCount = <span className="todo-count">{counter} items left</span>;
  const btn = buttons.map((item) => {
    const { id } = item;
    return (
      <li key={id}>
        <TasksFilter {...item} />
      </li>
    );
  });

  return (
    <footer className="footer">
      {todoCount}
      <ul className="filters">{btn}</ul>
      <button type="button" className="clear-completed" onClick={() => clearCompleted()}>
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
