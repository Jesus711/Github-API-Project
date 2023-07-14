import { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import RepoItem from './RepoItem';


function Home() {
  window.global ||= window;
  const [searched, setSearched] = useState("");
  const [saveSearch, setSaveSearch] = useState("");
  const [repos, setRepos] = useState([])

  const token = import.meta.env.VITE_GITHUB_API_TOKEN;
  const octokit = new Octokit( {auth: `${token}` });

  const base = import.meta.env.DEV ? '/' : '/Spotify-Web-Project/'


  useEffect(() => {

  }, [])


  async function handleFormSubmit(e: any) {
    e.preventDefault()

    

    if(searched !== saveSearch) {
      setRepos([])
    }

    setSaveSearch(searched)
    setSearched("")

    let header: any = document.getElementById('results-header')
    //console.log(header)
    header.style.display = "block";


    let loader: any = document.body.getElementsByClassName('loader')[0];
    //console.log(loader)
    loader.style.display = "block";

    let result_none: any = document.getElementById('no-results');
    result_none.style.display = "none";


    let search_result = await octokit.request(`GET /orgs/${searched}/repos`)
    .then(res => {
      if(res.status >= 400){
        console.log(res)
        return null;
      }

      return res.data
    }).catch(err => {
      result_none.style.display = "block";
      return null;
    })
    
    loader.style.display = "none";
    if(search_result === null){

      setRepos([])
      return;
    }

    result_none.style.display = "none";
    //loader.style.display = "none";
    setRepos(search_result)

    console.log(search_result)
  }


  return (
    <>
      <a className='title' href={base}>RepOrg Search</a>
      <p className='project-desc'>Search Popular Organizations Public GitHub Repositories</p>
      <form className='search-repo-form' onSubmit={(e) => {handleFormSubmit(e)}}>
        <input id='search-input' type="search" placeholder='Enter Org Name' value={searched} required onChange={(e) => {setSearched(e.target.value)}}></input>
        <button id='search-btn' type='submit'>Search</button>
      </form>
      <div className='results-section'>
        <h2 id='results-header'>Repos Results for {`'${saveSearch}'`} :</h2>
        <div className='repo-list'>
          {repos.length > 0 && repos.map(repo => {
            return (
              <RepoItem repo={repo}/>
            )
          })}

          <h2 id="no-results">No Repos Found</h2>
          <div className='loader'></div>

        </div>
      </div>
    </>
  )
}

export default Home