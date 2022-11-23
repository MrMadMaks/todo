import React, { useState, useEffect, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai/';
import Todo from '../Todo/Todo';
import { db } from '../../firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

import './App.less';

function App() {
  const [todos, setTodos] = useState([]);
  const [data, setData] = useState({ title: '', desc: '', date: '', img: null });
  const imageInputRef = useRef();

  const uploadImage = async () => {
    const imageRef = ref(storage, `images/${data.img.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, data.img);
    const imageLink = await getDownloadURL(snapshot.ref);
    return imageLink;
  };

  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  /**
   * @param  {} todo
   */
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };


  const createTodo = async (e) => {
    e.preventDefault();
    if (data.title === '') {
      alert('Введите корректное значение');
      return;
    }

    const imgLink = await uploadImage();

    const test = await addDoc(collection(db, 'todos'), {
      text: data.title,
      completed: false,
      descr: data.desc,
      date: data.date,
      url: imgLink,
    });

    console.log('test', test);
    setData({ title: '', desc: '', date: '', img: null });
    imageInputRef.current.value = "";
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const handleData = (e) => {
    if (e.target.name === 'img') {
      setData((prev) => ({ ...prev, img: e.target.files[0] }));
    } else {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="_container">
          <h1 className="title">Список задач</h1>
          <form
            onSubmit={(e) => createTodo(e)}
            className="form"
            method="post"
            encType="multipart/formdata"
          >
            <input
              value={data.title}
              name="title"
              onChange={(e) => handleData(e)}
              type="text"
              className="input"
              placeholder="Добавить задачу"
            />
            <input
              value={data.desc}
              name="desc"
              onChange={(e) => handleData(e)}
              type="text"
              className="input"
              placeholder="Добавить описание"
            />
            <input
              value={data.date}
              name="date"
              onChange={(e) => handleData(e)}
              type="date"
              className="input"
              placeholder="Дедлайн"
            />
            <input
              ref={imageInputRef}
              name="img"
              onChange={(e) => handleData(e)}
              type="file"
              className="input"
            />
            <button type="submit" className="button">
              <AiOutlinePlus size={35} />
            </button>
          </form>
          <ul>
            {todos &&
              todos.map((todo, idx) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  imageList={todo.url || ''}
                />
              ))}
          </ul>
          {todos.length < 1 ? null : (
            <p className="count">{`Количество задач: ${todos.length}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
