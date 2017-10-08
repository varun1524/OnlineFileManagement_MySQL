import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import MainPage from './components/MainPage';


class App extends Component {
      render() {
            return (
                <div className="App">
                    <BrowserRouter>
                        <div>
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
                            <MainPage/>
                        </div>
                    </BrowserRouter>
                </div>
            );
      }
}

export default App;
