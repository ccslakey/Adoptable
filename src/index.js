import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import App from './App';
import Pet from './Pet';


ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/pet/:id" component={Pet}/>
    </div>
</Router>, document.getElementById('root'));

registerServiceWorker();
