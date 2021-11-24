import React, { useState, useEffect, useContext } from 'react';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import MyContext from '../Context';

const Task = ({ title, id, date, timer, prevTimer, complete }) => {
  const [edit, setEdit] = useState(false);
  const [timerBtn, setTimerBtn] = useState(false);
  const [seconds, setSeconds] = useState(timer.min * 60 + +timer.sec);
  const [disabledBtn, setDisabledBtn] = useState(false);

  const { deleteTodo, actionTodo, editingTitleTodo, outputTimer } = useContext(MyContext);

  const distanceToNow = `created ${formatDistanceToNow(new Date(date), { addSuffix: true, includeSeconds: true })}`;

  const playClassName = 'icon icon-play';
  const pauseClassName = 'icon icon-pause';
  const icon = !timerBtn ? playClassName : pauseClassName;

  const min = Math.trunc(seconds / 60);
  const sec = seconds % 60;

  const prevMin = Math.trunc(prevTimer.sec / 60);
  const prevSec = prevTimer.sec % 60;

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
    if (seconds === 0) {
      setDisabledBtn(true);
    }
  }, [seconds]);

  useEffect(() => {
    if (complete) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [complete]);

  useEffect(() => {
    if (complete) {
      setTimerBtn(false);
    }
  }, [complete]);

  const buttonEdit = !complete ? (
    <button type="button" aria-label="Edit" className="icon icon-edit" onClick={() => setEdit(true)} />
  ) : null;

  const timerStop =
    prevTimer.sec !== seconds ? (
      <p className="timerStop">
        {prevMin.toString().padStart(2, '0')}:{prevSec.toString().padStart(2, '0')}
      </p>
    ) : null;

  const timerWork =
    timerBtn || seconds !== 0 ? `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : null;

  const timerSet =
    Number(prevTimer.sec) !== seconds || seconds !== 0 ? (
      <div className="description timer" role="presentation">
        <button
          type="button"
          className={icon}
          disabled={disabledBtn}
          aria-label="play"
          onClick={() => setTimerBtn(!timerBtn)}
        />
        {timerWork || timerStop}
      </div>
    ) : null;

  const task = (
    <div className="view">
      <input className="toggle" type="checkbox" defaultChecked={complete} onChange={() => actionTodo(id, 'complete')} />
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
