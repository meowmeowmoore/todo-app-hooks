import React, { useState, useContext } from 'react';
import MyContext from '../Context';

const NewTaskForm = () => {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoTimerMin, setTodoTimerMin] = useState('');
  const [todoTimerSec, setTodoTimerSec] = useState('');

  const { addTodo } = useContext(MyContext);

  const transferToMain = (event) => {
    if (event.key === 'Enter') {
      if (todoTitle !== '') {
        addTodo(todoTitle, todoTimerMin, todoTimerSec);
        setTodoTitle('');
        setTodoTimerMin('');
        setTodoTimerSec('');
      }
    }
  };

  const typeCheckingMin = (event) => {
    if (event.target.value.search(/^[0-9]*$/) !== -1) {
      setTodoTimerMin(event.target.value);
    }
  };

  const typeCheckingSec = (event) => {
    if (event.target.value.search(/^[0-9]*$/) !== -1) {
      setTodoTimerSec(event.target.value);
    }
  };

  return (
    <>
      <h1>todos</h1>
      <form className="new-todo-form" role="presentation" onKeyPress={(event) => transferToMain(event)}>
        <input
          className="new-todo"
          type="text"
          value={todoTitle}
          placeholder="Task"
          maxLength="70"
          onChange={(event) => setTodoTitle(event.target.value)}
        />
        <input
          className="new-todo-form__timer"
          value={todoTimerMin}
          placeholder="Min"
          onChange={(event) => typeCheckingMin(event)}
        />
        <input
          className="new-todo-form__timer"
          value={todoTimerSec}
          placeholder="Sec"
          onChange={(event) => typeCheckingSec(event)}
        />
      </form>
    </>
  );
};

export default NewTaskForm;
