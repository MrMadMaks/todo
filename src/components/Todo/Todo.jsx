import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import './Todo.less';

const Todo = ({ todo, toggleComplete, deleteTodo, imageList }) => {
    return (
        <li className={todo.completed ? 'itemComplete' : 'item'}>
            <div className="row">
                <input onChange={() => toggleComplete(todo)} type="checkbox" checked={todo.completed ? 'checked' : ''} />
                <div className='col' >
                    <h2>Название</h2>
                    <div onClick={() => toggleComplete(todo)} className={todo.completed ? 'textComplete' : 'text'}>{todo.text}</div>
                    <h2>Описание</h2>
                    <div className={todo.completed ? 'textComplete' : 'text'}>{todo.descr}</div>
                    <div >{imageList.map((url, i) => {
                        if (i === (imageList.length - 1)) {
                            return <img key={url} className='picture' src={url} alt="твой файл" />
                        }
                    })}</div>
                    <div className={dayjs(todo.date).isAfter(dayjs()) ? null : 'deadline'}>{dayjs(todo.date).isAfter(dayjs()) ? `${todo.date}` : 'Задача просрочена!'}</div>
                </div>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className='button' >{<FaRegTrashAlt size={20} />}</button>
        </li>
    );
};

export default Todo;