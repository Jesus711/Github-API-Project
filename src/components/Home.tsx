import { useEffect, useState } from 'react';
import { Octokit } from '@octokit/core';
import RepoItem from './RepoItem';


interface Repo {
  id: number,
  name: string,
  node_id : string,
  full_name : string,
  private : boolean,
  owner : object,
  html_url : string,
  description : string,
  fork : boolean,
  url : string,
  forks_url : string,
  keys_url : string,
  collaborators_url : string,
  teams_url : string,
  hooks_url : string,
  issue_events_url : string,
  events_url : string,
  assignees_url : string,
  branches_url : string,
  tags_url : string,
  blobs_url : string,
  git_tags_url : string,
  git_refs_url : string,
  trees_url : string,
  statuses_url : string,
  languages_url : string,
  stargazers_url : string,
  contributors_url : string,
  subscribers_url : string,
  subscription_url : string,
  commits_url : string,
  git_commits_url : string,
  comments_url : string,
  issue_comment_url : string,
  contents_url : string,
  compare_url : string,
  merges_url : string,
  archive_url : string,
  downloads_url : string,
  issues_url : string,
  pulls_url : string,
  milestones_url : string,
  notifications_url : string,
  labels_url : string,
  releases_url : string,
  deployments_url : string,
  created_at : string,
  updated_at : string,
  pushed_at : string,
  git_url : string,
  ssh_url : string,
  clone_url : string,
  svn_url : string,
  homepage : string,
  size : number,
  stargazers_count : number,
  watchers_count : number,
  language : string,
  has_issues : boolean,
  has_projects : boolean,
  has_downloads : boolean,
  has_wiki : boolean,
  has_pages : boolean,
  has_discussions : boolean,
  forks_count : number,
  mirror_url : object,
  archived : boolean,
  disabled : boolean,
  open_issues_count : number,
  license : object,
  allow_forking : boolean,
  is_template : boolean,
  web_commit_signoff_required : boolean,
  topics : object,
  visibility : string,
  forks : number,
  open_issues : number,
  watchers : number,
  default_branch : string,
  permissions : object,

}

function Home() {
  window.global ||= window;
  const [searched, setSearched] = useState(() => {
    let search = window.sessionStorage.getItem('search')
    return search === null ? "" : search;
  });
  const [saveSearch, setSaveSearch] = useState("");
  const [repos, setRepos] = useState(() => {
    let repos_results;
    let previous_results: string | null = window.sessionStorage.getItem('results')
    if (previous_results != null){
      repos_results = JSON.parse(previous_results)

      console.log(typeof previous_results)
      console.log(repos_results)

      return repos_results
    }
    return [];
})

  const token = import.meta.env.VITE_GITHUB_API_TOKEN;
  const octokit = new Octokit( {auth: `${token}` });

  const base = import.meta.env.DEV ? '/' : '/Spotify-Web-Project/'


  useEffect(() => {
      if(searched !== "")
        handleFormSubmit(null)
  }, [])


  async function handleFormSubmit(e: any) {
    if(e !== null){
      e.preventDefault()
    }

    

    if(searched !== saveSearch) {
      setRepos([])
    }

    setSaveSearch(searched)
    setSearched("")

    window.sessionStorage.setItem('search', searched);

    let header: any = document.body.getElementsByClassName('results-header')
    console.log(header)

    header[0].style.display = 'block';
    header[1].style.display = 'none';



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
      header[1].style.display = 'none';
      return null;
    })
    
    loader.style.display = "none";
    if(search_result === null){

      setRepos([])
      return;
    }

    sortRepos(search_result);

    result_none.style.display = "none";
    header[1].style.display = 'block';
    //loader.style.display = "none";
    window.sessionStorage.setItem('results', JSON.stringify(search_result));
    setRepos(search_result)

    //console.log(search_result)
  }


  function sortRepos(reposList: Array<Repo>): void {
    reposList.sort((a, b) => {
      if(a.stargazers_count > b.stargazers_count){
        return -1;
      }

      if (a.stargazers_count < b.stargazers_count) {
        return 1;
      }

      return 0;
    })
  }


  return (
    <>
      <a className='title' href={base}>RepOrg Search</a>
      <p className='project-desc'>Search Popular Organizations Public GitHub Repositories</p>
      <form className='search-repo-form' onSubmit={(e) => {handleFormSubmit(e)}}>
        <input id='search-input' type="search" placeholder="Enter An Org's Name" value={searched} required onChange={(e) => {setSearched(e.target.value)}}></input>
        <button id='search-btn' type='submit'>Search</button>
      </form>
      <div className='results-section'>
        <h2 className='results-header'>Repos Results for {`'${saveSearch}'`}</h2>
        <h2 className='results-header'>Click on Repo to View:</h2>
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
