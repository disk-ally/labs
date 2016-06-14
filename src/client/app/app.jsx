import React from 'react';
import {render} from 'react-dom';

const fs = require('fs');
const path = require('path');

class App extends React.Component {
  constructor (props) {
  	super(props);
    this.state = { 
    	path: "/users",
    	label: "Loading",
    	tree: []
    };
  }
 
  componentWillMount () {
    this.readDir( this.state.path );
  }

  pushTree(node) {
  	var temp = this.state.tree;
  	temp.push(node);
  	this.setState({tree: temp});

  }

  readDir(dir) {
  	  var status;
  	  	var i = 0;
  	  	var size = 0;

  	fs.readdir(dir, (err, data) => {
  	  if(data){
  	  	for(i; i<data.length; i++) {
  	      fs.stat(path.join(dir, data[i]), (err, stat) => {
  	        if(stat){
  	        	this.pushTree(stat['size']);
  	        }
  	      });
  	  	}
  	  }
  	});
  	console.log(this.state.tree);

  }

  render () {
    return <p>{ this.state.label }</p>;
  }
}

render(<App/>, document.getElementById('content'));
