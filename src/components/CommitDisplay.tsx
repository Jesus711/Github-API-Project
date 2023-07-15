import React from 'react'
import { useLocation } from 'react-router-dom';
import {useState} from 'react'


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


export default function CommitDisplay() {

    const location = useLocation();
    console.log(location.state);
    const [commit, setCommit] = useState<Commit>(location.state.commit);



    return (
        <div className='commit'>
            <h1>Commit</h1>
            <ul>
                <li>Username: {commit.author.login}</li>
                <li>Date: {commit.commit.author.date}</li>
                <li>Hash: {commit.sha}</li>
            </ul>
            <h2>Message:</h2>
            <p>{commit.commit.message}</p>
        </div>
    )
}
