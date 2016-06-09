import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <p>Now we can play!!</p>;
  }
}

render(<App/>, document.getElementById('content'));
