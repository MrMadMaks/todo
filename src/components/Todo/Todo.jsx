import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiEdit2Fill } from "react-icons/ri";
import { AiOutlineReload } from "react-icons/ai";
import dayjs from 'dayjs';
import { db } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import './Todo.less';

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState(todo);
    console.log(data)

    const handleChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        await updateDoc(doc(db, 'todos', todo.id), {
            text: data.text,
            descr: data.descr,
            date: data.date,
        });
        setIsEdit(false);
    };

    console.log(data.text);
    return (
        <li className={todo.completed ? 'itemComplete' : 'item'}>
            <div className="row">
                <input
                    onChange={() => toggleComplete(todo)}
                    type="checkbox"
                    checked={todo.completed ? 'checked' : ''}
                />
                <div className="col">
                    <h2>Название</h2>
                    {isEdit ? (
                        <>
                            <input
                                className='input'
                                value={data.text}
                                name="text"
                                onChange={(e) => handleChange(e)}
                            ></input>
                            <input
                                className='input'
                                value={data.descr}
                                name="descr"
                                onChange={(e) => handleChange(e)}
                            ></input>
                            <input
                                type='date'
                                className='input'
                                value={data.date}
                                name="date"
                                onChange={(e) => handleChange(e)}
                            ></input>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => toggleComplete(todo)}
                                className={todo.completed ? 'textComplete' : 'text'}
                            >
                                {todo.text}
                            </div>
                            <h2>Описание</h2>
                            <div className={todo.completed ? 'textComplete' : 'text'}>
                                {todo.descr}
                            </div>
                            <img className="picture" src={todo.url} alt="твой файл" />
                            <div
                                className={
                                    dayjs(todo.date).isAfter(dayjs()) ? null : 'deadline'
                                }
                            >
                                {dayjs(todo.date).isAfter(dayjs())
                                    ? `${todo.date}` : 'Задача просрочена!'}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className='buttons'>
                <button onClick={() => deleteTodo(todo.id)} className="button">
                    {<FaRegTrashAlt size={30} />}
                </button>
                <button className="button" onClick={() => setIsEdit((prev) => !prev)}><RiEdit2Fill size={30} /></button>
                {isEdit && <button className="button" onClick={() => handleUpdate()}><AiOutlineReload size={30} /></button>}
            </div>
        </li>
    );
};

export default Todo;