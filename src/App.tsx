import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import './App.css';
import RepoDisplay from './components/RepoDisplay';
import CommitDisplay from './components/CommitDisplay';

export default function App() {

  const base = import.meta.env.DEV ? '/' : '/Github';
  console.log(base);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={base} element={<Home/>}></Route>
        <Route path={`${base}:repo`} element={<RepoDisplay/>}/>
        <Route path={`${base}:repo/:commit`} element={<CommitDisplay/>}/>
      </Routes>
    </BrowserRouter>
  )
}
