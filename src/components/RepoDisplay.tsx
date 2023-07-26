import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Octokit } from 'octokit';

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

interface Commit {
  sha : string,
  node_id : string,
  commit : object,
  url : string,
  html_url : string,
  comments_url : string,
  author : object,
  committer : object,
  parents : object,
}


export default function RepoDisplay() {

  const location = useLocation();

  const [repoInfo, setRepo] = useState<Repo>(() => {
      console.log(location.state.repo);
      return location.state.repo;
    })

  const [commits, setCommits] = useState<Array<Commit>>([])

  
  const token = import.meta.env.VITE_GITHUB_API_TOKEN;
  const octokit = new Octokit( {auth: `${token}` });

  const base = import.meta.env.DEV ? '/' : '/Spotify-Web-Project/';

  const navigate = useNavigate();


  useEffect(() => {
    getRepoCommits()
  }, [])


  async function getRepoCommits() {

    console.log("HERE", commits, commits.length)

    let commits_result = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: repoInfo.owner.login,
      repo: repoInfo.name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    .then(res => {
      if(res.status >= 400){
        console.log(res)
        return null;
      }
      return res.data
    }).catch(err => {
      console.log(err);
    })

    //Gets all values typing to create type interface
    // let keys: any = Object.keys(commits_result[0]);
    // console.log(keys)
    // for(let key of keys){
    //   console.log(`${key} : ${typeof commits_result[0][key]},`)
    // }

    if (commits_result === null){
      setCommits([]);
      return;
    }
    
    console.log("COMMITS", commits_result)
    setCommits(commits_result)
  }
    

  return (
    <div className='repo-display'>
      <h2 className='title'>{repoInfo.name}</h2>
      <h3>Description:</h3>
      <p className='description'>{repoInfo.description}</p>
      <table className='repo-details'>

        <tr>
          <th colSpan={2}>
            Details
          </th>
        </tr>

        <tr>
          <td>Date Created</td>
          <td>{repoInfo.created_at}</td>
        </tr>

        <tr>
          <td>Language</td>
          <td>{repoInfo.language}</td>
        </tr>

        <tr>
          <td>Forks</td>
          <td>{repoInfo.forks_count}</td>
        </tr>

        <tr>
          <td>Stars</td>
          <td>{repoInfo.stargazers_count}</td>
        </tr>
      </table>

      <a className='github-link' target='_blank' href={repoInfo.url ? repoInfo.html_url : '#'}>Click to View Github Repo</a>


      {commits.length !== 0 && <div>      
            <h2 className='commit-header'>Commits</h2>
            <h3 className='commit-header'><u>Click Commit to View Info</u></h3>
          </div>}

      {commits.length === 0 ? <div className='no-commits'>No Commits Found</div> :

        <div className='commits-list'>
        {commits.length > 0 && commits.map(commit => {
          return (
            <a 
            className='commit-btn' 
            onClick={() => navigate(`${base}${repoInfo.name}/commit?=${commit.sha}`, 
            {replace: false, state: { "commit": commit }})}>
              <ul>
                <li>User: {commit.commit.author.name}</li>
                <li>Date: {commit.commit.committer.date.substring(0, 10)}</li>
              </ul>
            </a>
          )
        })}
        </div>
      }

    </div>
  )
}
