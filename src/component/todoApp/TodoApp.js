import React, { useState, useEffect } from 'react';
import TaskList from '../Main';
import Footer from '../footer';
import MyContext from '../Context';
import NewTaskForm from '../Header';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [buttons, setButtons] = useState([
    { value: 'All', selected: true, id: '1' },
    { value: 'Active', selected: false, id: '2' },
    { value: 'Completed', selected: false, id: '3' },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem('todos');
    setTodos(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title, min, sec) => {
    setTodos([
      ...todos,
      {
        title,
        id: Date.now(),
        date: new Date(),
        timer: {
          min: min.padStart(2, '0'),
          sec: sec.padStart(2, '0'),
        },
        initialTimer: {
          min: min.padStart(2, '0'),
          sec: sec.padStart(2, '0'),
        },
        complete: false,
      },
    ]);
  };

  const deleteTodo = (id) => {
    const newArray = todos.filter((item) => item.id !== id && item);
    return setTodos(newArray);
  };

  const clearCompleted = () => {
    setTodos(todos.filter((item) => !item.complete));
  };

  const actionTodo = (id, action) => {
    setTodos(
      todos.map((item) => {
        const task = item;
        if (item.id === id) {
          task[action] = !item[action];
        }
        return task;
      })
    );
  };

  const editingTitleTodo = (id, value) => {
    setTodos(
      todos.map((item) => {
        const task = item;
        if (item.id === id) {
          task.title = value;
        }
        return task;
      })
    );
  };

  const clickFilter = (valueButton) => {
    setButtons(
      buttons.map((item) => {
        const btn = item;
        btn.selected = false;
        if (btn.value === valueButton) {
          btn.selected = !btn.selected;
        }
        return btn;
      })
    );
  };

  const selectTodos = () => {
    let activeTask;
    let completedTask;
    let allTask;

    buttons.forEach((item) => {
      if (item.selected) {
        activeTask = item.value === 'Active' ? todos.filter((task) => !task.complete) : null;
        completedTask = item.value === 'Completed' ? todos.filter((task) => task.complete) : null;
        allTask = item.value === 'All' ? todos : null;
      }
    });

    return activeTask || completedTask || allTask;
  };

  const outputTimer = (newMin, newSec, id) => {
    setTodos(
      todos.map((item) => {
        const task = item;
        if (task.id === id) {
          task.timer = {
            min: newMin.toString().padStart(2, '0'),
            sec: newSec.toString().padStart(2, '0'),
          };
        }
        return task;
      })
    );
  };

  return (
    <MyContext.Provider
      value={{
        deleteTodo,
        actionTodo,
        editingTitleTodo,
        clickFilter,
        clearCompleted,
        outputTimer,
        addTodo,
      }}
    >
      <section className="todoapp">
        <header className="header">
          <NewTaskForm />
        </header>
        <section className="main">
          <TaskList todos={selectTodos()} />
        </section>
        <footer className="footer">
          <Footer buttons={buttons} todos={todos} />
        </footer>
      </section>
    </MyContext.Provider>
  );
};

export default TodoApp;
