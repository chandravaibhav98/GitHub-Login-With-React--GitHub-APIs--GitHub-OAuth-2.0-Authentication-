import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';

const CLIENT_ID = 'd2febfed701b68510813';

function App() {

  const [reRender, setRerender] = useState(false);
  const [userData, setUserData] = useState({}_);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    console.log(codeParam);

    if (codeParam && (localStorage.getItem('accessToken') === null)) {
      async function getAccessToken() {
        await fetch('http://localhost:4000/getAccessToken?code=' + codeParam, {
          method: 'GET'
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token);
            setRerender(!reRender);
          }
        })
      }
    }
  }, [reRender]);

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer' + localStorage.getItem('accessToken')
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      setUserData(data);
    })
  }

  function LoginWithGithub() {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem('accessToken') ?
          <>
            <h5>We have the access Token</h5>
            <button onClick={() => { localStorage.removeItem('accessToken'); setRerender(!reRender)}}>
              Log Out
            </button>
            <h6>Get User Data from Github API</h6>
            <button onClick={getUserData}>getUserData</button>
            (Object.keys(userData).length !== 0 ?
            <>
              <h6>Hey! {userData.login}</h6>
              <img width='100px' height='100px' src={userData.avatar_url}></img>
              <a href={userData.html_url} style={{'color':'white'}}>Go to Github Profile</a>
            </>
            :
            <>
            </>
            )
          </>
          :
          <>
            <h6>User is not Logged in</h6>
            <button onClick={LoginWithGithub}>Login with Github</button>
          </>
        }
        
      </header>
    </div>
  );
}

export default App;
