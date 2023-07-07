import { useEffect, useState } from 'react';
import './App.css';
import { Octokit } from '@octokit/core';


function App() {
  window.global ||= window;
  const [searched, setSearched] = useState("");

  const token = import.meta.env.VITE_GITHUB_API_TOKEN;
  const octokit = new Octokit( {auth: `${token}` });

  useEffect(() => {

  }, [])


  async function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(searched)
    let search_result = await octokit.request(`GET /orgs/${searched}/repos`)
    console.log(search_result)
  }


  return (
    <>
      <h1 className='title'>RepOrg Search</h1>
      <p className='project-desc'>Search Popular Organizations Public GitHub Repositories</p>
      <form className='search-repo-form' onSubmit={(e) => {handleFormSubmit(e)}}>
        <input id='search-input' type="search" placeholder='Enter Org Name' value={searched} onChange={(e) => {setSearched(e.target.value)}}></input>
        <button id='search-btn' type='submit'>Search</button>
      </form>
      <div className='results'>
        <h2>Search Results:</h2>
      </div>
    </>
  )
}

export default App
