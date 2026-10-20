import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import GithubRepositories from './pages/GithubRepositories';
import Header from './components/Header';
import Footer from './components/Footer';
import SideBar from './components/SideBar';

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
    <Header/>
    <GithubRepositories keyword="자바 language:Java"/>
    <SideBar/>
    <Footer/>
    </>
  )
}

export default App
