import React, {Component} from "react";
import {render} from "react-dom";
import Dashboard from "./Dashboard";
import Filter from "./Filter";

export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:{},
            loaded: false,
            placeholder: "Loading"
        };
    }

    componentDidMount(){
        fetch("http://localhost:8000/api/getDates/",{
            method:"GET",
            headers:{
                'Accept': 'application/json',
                'Content-type':'application/json'
            }
        }).then(response => {
            if (response.status > 400){
                return this.setState(() => {
                    return{ placeholder: "Error" }
                });
            }
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState(() => {
                return {
                    data,
                    loaded: true
                }
            });
        });
    }

    render(){
        if (this.state.loaded){
            return (<div><p>{ this.state.data['min'][0]}</p> <Dashboard></Dashboard></div>);
        } 
        return (
        <div>
            <p>Loading</p>
            <Dashboard></Dashboard>
            <Filter/>
        </div>);
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv)