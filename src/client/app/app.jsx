import React from 'react';
import {render} from 'react-dom';
import ReactD3 from 'rd3';

const fs = require('fs');
const path = require('path');

/**
 * APP's main class
 */
class App extends React.Component {

    /**
     * Extends React component Constructor and populate
     * the initial states
     * @param props
     */
    constructor(props) {
        super(props);

        // Declare the first message
        const initialMessage = "loading";

        // Default path (only macOs)
        // TODO: support windows environment
        const firstpath = "/users";
        var firstSet = new Set();
        firstSet.add(firstpath);

        // D3 initial Data
        this.workingTree = [{
            label: 'Disk',
            values: []
        }];

        this.list = firstSet;

        // set initial states
        this.state = {
            path: firstpath,
            label: initialMessage,
            progress: initialMessage,
            tree: [{
                label: 'Disk',
                values: []
            }]
        };
    }

    /**
     * Fired by React lifecycle
     */
    componentWillMount() {
        const intervalTime = 600;
        const limit = 100;

        let working = false;
        let readed = 0;
        let index;
        let operations;

        // Create and Interval
        setInterval(() => {
            // Reset the index and operations vars
            index = operations = 0;

            // Check if the last task is working
            if (working == false) {
                working = true;

                // Loop the ES6 Set from the first item until the readed index plus operations limit
                for (var dir of this.list) {
                    index++;

                    // Check if the item must be analysed
                    if (index >= readed) {

                        // Check if the operations count is less then the operations limit
                        if (operations < limit) {

                            // Use try, some directories may contain permission issues or moved since the queue
                            try {
                                this.readDir(dir);
                            } catch (e) {
                                console.log(e);
                            }

                            operations++;
                            readed++;
                        } else {
                            // Update DOM labels with react
                            this.state.progress = readed + " From " + this.list.size;
                            this.state.label = dir;
                            this.setState({tree: this.workingTree});

                            //The operations limit was reached, wait until the next interval
                            working = false;
                            break;
                        }
                    }
                }
            }
        }, intervalTime);
    }

    /**
     * Read the dir and append the file to an internal ES6 Set
     * @param dir
     */
    readDir(dir) {
        var size = 0;
        let fileList = fs.readdirSync(dir);
        if (fileList.length != 0) {
            for (let i = 0; i < fileList.length; i++) {
                let fileName = fileList[i];
                let fileDir = path.join(dir, fileName);
                let stat = fs.statSync(fileDir);

                if (stat) {
                    if (stat.isDirectory()) {
                        this.list = this.list.add(fileDir);
                    } else {
                        if (stat['size'] / 1000000.0 > 100) {
                            this.workingTree[0].values.push({x: fileName, y: stat['size']});
                        }
                    }
                }
            }
        }
    }

    render() {
        return (
            <div>
                <BarChart
                    width={800}
                    height={400}
                    data={this.state.tree}
                />

                <h1>{ this.state.progress }</h1>
                <h4>{ this.state.label }</h4>
            </div>
        )
    }
}

/**
 * RD3 Bar chart component
 */
class BarChart extends ReactD3.BarChart {
    constructor(props)
    {
        super(props);
    }
}

render(<App/>, document.getElementById('content'));
