import { useEffect, useState } from 'react';
import './App.css'
import Loading from './components/GithubRepositories'
import axios from 'axios';
import GithubRepositories from './components/GithubRepositories';

function App() {
//   const [gits, setGits] = useState([]);

//   const initSet = async ()=>{
//     await axios.get(
//   "https://api.github.com/search/repositories",
//   {
//     params: {
//       q: `${''} language:Java`,
//       sort: "stars",
//       order: "desc",
//       per_page: 10,
//       page: 1,
//     },
//   }
// );
//   };

//   useEffect(()=>{
//     initSet();
//   });

  return (
    <>
    <GithubRepositories keyword="자바 language:Java"/>
    </>
  )
}

export default App
