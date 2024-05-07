//import { useState, useEffect } from "react";
//import { useDispatch, useSelector } from "react-redux";
import logo from '../../logo.svg';
import Searchbar from '../../components/Seachbar/Searchbar';

const Homepage = () => {

    return (
        <div className="App">
            <Searchbar></Searchbar>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                Learn React
                </a>
            </header>
        </div>
    )
}

export default Homepage;