import React, {Component} from "react";
import "./Toolkit";

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default class Filter extends Component{
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            data:[],
            loaded: false,
            placeholder: "Loading"        };
    }

    componentWillUnmount(){
        this._isMounted = false
    }

    componentDidMount(){
        this._isMounted = true
        console.log(this.props)
        fetch("http://localhost:8000/api/filter/",{
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify({
                'start-date':964915200,
                'finish-date':1182729600,
                'productId': -1,
                'profileName': "L"
            })
        }).then(response => {
            if (response.status > 400){
                return this.setState(() => {
                    return{ placeholder: "Error" }
                });
            }
            return response.json();
        }).then(data => {
            if (this._isMounted){
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    }
                });
            }
        });
    }

    render(){
        return <div> <p>H</p></div>;
    }
}
