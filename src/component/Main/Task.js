import React, { useState, useEffect, useContext } from 'react';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import MyContext from '../Context';

const Task = ({ title, id, date, timer, initialTimer, complete }) => {
  const [edit, setEdit] = useState(false);
  const [timerBtn, setTimerBtn] = useState(false);
  const [seconds, setSeconds] = useState(timer.min * 60 + +timer.sec);

  const { deleteTodo, actionTodo, editingTitleTodo, outputTimer } = useContext(MyContext);

  const distanceToNow = `created ${formatDistanceToNow(new Date(date), { addSuffix: true, includeSeconds: true })}`;

  const playClassName = 'icon icon-play';
  const pauseClassName = 'icon icon-pause';
  const icon = !timerBtn ? playClassName : pauseClassName;

  const min = Math.trunc(seconds / 60);
  const sec = seconds % 60;

  const initialSeconds = initialTimer.min * 60 + +initialTimer.sec;

  const tick = () => {
    if (seconds > 0) {
      setSeconds((prev) => prev - 1);
    }
  };

  useEffect(() => {
    let interval;
    if (timerBtn) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timerBtn]);

  useEffect(() => {
    outputTimer(min, sec, id);
  }, [timerBtn]);

  useEffect(() => {
    if (seconds === 0) {
      setTimerBtn(false);
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0 && !complete && initialSeconds > 0) {
      actionTodo(id, 'complete');
    }
  }, [seconds]);

  useEffect(() => {
    if (complete) {
      setTimerBtn(false);
    }
  }, [complete]);

  const buttonEdit = !complete ? (
    <button type="button" aria-label="Edit" className="icon icon-edit" onClick={() => setEdit(true)} />
  ) : null;

  const timerStop =
    complete && seconds === 0 ? (
      <p className="timerStop">
        {initialTimer.min.toString().padStart(2, '0')}:{initialTimer.sec.toString().padStart(2, '0')}
      </p>
    ) : null;

  const timerStopButNotEnd =
    complete && seconds > 0 ? (
      <p className="timerStop">
        {min.toString().padStart(2, '0')}:{sec.toString().padStart(2, '0')}
      </p>
    ) : null;

  const timerWork =
    !complete && seconds > 0 ? `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : null;

  const disabledBtn = complete || (seconds === 0 && !complete);

  const timerReset = () => {
    if (seconds === 0) {
      outputTimer(initialTimer.min, initialTimer.sec, id);
      setSeconds(initialTimer.min * 60 + +initialTimer.sec);
    } else {
      outputTimer(min, sec, id);
    }
  };

  const onChangeCheckbox = () => {
    if (complete) {
      timerReset();
    }
    actionTodo(id, 'complete');
  };

  const timerSet =
    Number(initialTimer.sec) !== seconds || seconds !== 0 ? (
      <div className="description timer" role="presentation">
        <button
          type="button"
          className={icon}
          disabled={disabledBtn}
          aria-label="play"
          onClick={() => setTimerBtn(!timerBtn)}
        />
        {timerWork || timerStop || timerStopButNotEnd}
      </div>
    ) : null;
  const task = (
    <div className="view">
      <input className="toggle" type="checkbox" checked={complete} onChange={onChangeCheckbox} />
      <div className="view-label">
        <div className="title" role="presentation">
          <p>{title}</p>
        </div>
        {timerSet}
        <div className="description">{distanceToNow}</div>
      </div>
      {buttonEdit}
      <button type="button" aria-label="Destroy" className="icon icon-destroy" onClick={() => deleteTodo(id)} />
    </div>
  );

  const className = '';
  const completeClass = complete ? `${className} completed` : null;
  const editClass = edit ? `${className} editing` : null;

  const editTitle = (event) => {
    if (event.code === 'Enter') {
      editingTitleTodo(id, event.target.value);
      setEdit(false);
    }
  };

  const changer = edit ? (
    <input type="text" defaultValue={title} className="edit" onKeyPress={(event) => editTitle(event)} />
  ) : (
    task
  );

  return <li className={completeClass || editClass}>{changer}</li>;
};

export default Task;
