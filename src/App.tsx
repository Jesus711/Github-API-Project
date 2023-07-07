import { useEffect, useState } from 'react';
import './App.css';
import { Octokit } from '@octokit/core';
import RepoItem from './components/RepoItem';


function App() {
  window.global ||= window;
  const [searched, setSearched] = useState("");
  const [saveSearch, setSaveSearch] = useState("");
  const [repos, setRepos] = useState([])

  const token = import.meta.env.VITE_GITHUB_API_TOKEN;
  const octokit = new Octokit( {auth: `${token}` });

  useEffect(() => {

  }, [])


  async function handleFormSubmit(e: any) {
    e.preventDefault()

    setSearched("")
    setSaveSearch(searched)
    let search_result = await octokit.request(`GET /orgs/${searched}/repos`)
    .then(res => {
      if(res.status >= 400){
        return null;
      }

      return res.data
    }).catch(err => {
      console.log(err);
    })

    if(search_result === null){
      setRepos([])
      return;
    }


    setRepos(search_result)

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
      <div className='results-section'>
        <h2>{`'${saveSearch}'`} Search Results:</h2>
        <div className='repo-list'>
          {repos.length > 0 && repos.map(repo => {
            return (
              <RepoItem repo={repo}/>
            )
          })}


        </div>
      </div>
    </>
  )
}

export default App
