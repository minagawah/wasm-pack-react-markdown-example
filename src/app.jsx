import React from 'react';
import { Route, Link } from 'react-router-dom';
import logo from './logo.svg';

import { Home } from 'components/home';
import { Experiments } from 'components/experiments';

import 'styles.css';

export const App = () => (
  <div className="app">
    <header>
      <Link to='/'>
        <img src={logo} className="logo" alt="logo" />
      </Link>
      <Link to='/'>Top</Link>
      <Link to='/experiments'>Experiments</Link>
    </header>

    <div className="container">
      <Route exact path='/' component={Home} />
      <Route path='/experiments' component={Experiments} />
    </div>
  </div>
);
