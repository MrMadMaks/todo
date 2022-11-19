import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai/';
import Todo from '../Todo/Todo';
import { db } from '../../firebase';
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { storage } from '../../firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

import './App.less';

function App() {

  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [descr, setDescr] = useState('')
  const [date, setDate] = useState('')
  const [imageUpload, setImageUpload] = useState(null)
  const [imageList, setImageList] = useState([])

  console.log(imageList)

  const imagesListRef = ref(storage, 'images/')

  const uploadImage = () => {
    if (imageUpload === null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url])
      })
    })
  }

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach(item => {
        getDownloadURL(item).then(url => {
          setImageList((prev) => [...prev, url])
        })
      })
    })
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'todos'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = []
      querySnapshot.forEach(doc => {
        todosArr.push({ ...doc.data(), id: doc.id })
      });
      setTodos(todosArr)
    })
    return () => unsubscribe()
  }, [])

  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed
    })
  }

  const createTodo = async (e) => {
    e.preventDefault()
    if (input === '') {
      alert('Введите корректное значение')
      return
    }
    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
      descr: descr,
      date: date,
      url: imageList[imageList.length - 1]
    })
    setInput('')
    setDescr('')
    setDate('')
  }

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id))
  }

  return (
    <div className="App">
      <div className="wrapper">
        <div className="_container">
          <h1 className='title' >Список задач</h1>
          <form onSubmit={createTodo} className="form" method='post' encType='multipart/formdata' >
            <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="input" placeholder='Добавить задачу' />
            <input value={descr} onChange={(e) => setDescr(e.target.value)} type="text" className="input" placeholder='Добавить описание' />
            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="input" placeholder='Дедлайн' />
            <input onChange={(e) => setImageUpload(e.target.files[0])} type="file" className="input" />
            <button onClick={uploadImage} className="button" ><AiOutlinePlus size={35} /></button>
          </form>
          <ul>
            {todos.map((todo) => (
              <Todo key={todo.id} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} imageList={imageList} />
            ))}
          </ul>
          {todos.length < 1 ? null : <p className='count' >{`Количество задач: ${todos.length}`}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
