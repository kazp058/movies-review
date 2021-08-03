import React, {Component} from "react";
import {render} from "react-dom";
import Dashboard from "./Dashboard";
import Filter from "./Filter";
import HideAppBar from "./elements/HideAppBar";
import {Grid } from "@material-ui/core";
import FilterAccordion from "./elements/FilterAccordion";
import ContentBox from "./elements/ContentBox";

export default class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:{
                canti:0,
                prom:0,
                minval:0,
                maxval:0,
                top: [],
                bot:[],
                chart:[]
            },
            loaded: false,
            placeholder: "Loading",
            chart: []
        };
    }    

    callbackFunction = (childData) => {
        this.setState({data: childData});
    }

    render(){
        console.log(this.state.data.chart);

        return(
            <div>
                <HideAppBar></HideAppBar>
                <Grid container spacing={0}>
                    <Grid item xs = {3}>
                        <FilterAccordion parentCallback = {this.callbackFunction}></FilterAccordion>
                    </Grid>
                    <Grid item xs = {1}></Grid>
                    <Grid item xs = {8}>
                        <ContentBox chart={this.state.data.chart} top={this.state.data.top} bot={this.state.data.bot} dataFromParent={this.state.data}></ContentBox>
                    </Grid>
                </Grid>
            </div>
        );
        
        if (this.state.loaded){
            return (<div><p>{ this.state.data['min'][0]}</p> <Dashboard></Dashboard></div>);
        } 
        return (
        <div>
            <HideAppBar></HideAppBar>
            <p>Loading</p>
            <Dashboard></Dashboard>
            <Filter/>
        </div>);
        
    }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv)