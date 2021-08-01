import React, {Component} from "react";
import {render} from "react-dom";
import Dashboard from "./Dashboard";

export default class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <Dashboard></Dashboard>;
    }
}

const appDiv = document.getElementById("app");
render(<App name="rex"/>, appDiv)