import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TextField } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';


export default class FilterAccordion extends Component {

    constructor(props){
        super(props);

        this.state = {
            min: '0',
            max: '0',
            idName: '',
            idProduct: '',
            prom: 0,
            canti:0,
            minval:0,
            maxval:0,
            top:[],
            bot:[],
            chart:[]
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
            this.setState(() => {
                return {
                    min:data['min'],
                    max: data['max'],
                    loaded: true
                }
            });
        });
    }

    handelBotChange = (event) => {
            this.setState(() =>{
            return {
                min: event.target.value
            }
        });
    };

    handelTopChange = (event) => {
        this.setState(() =>{
            return {
                max: event.target.value
            }
        });
    };

    handleName = (event) =>{
        this.setState(()=>{
            this.setState(()=>{
                return{
                    idName: event.target.value
                }
            });
        });
    };
    handleProduct = (event) =>{
        this.setState(()=>{
            this.setState(()=>{
                return{
                    idProduct: event.target.value
                }
            });
        });
    };

    sendData = () =>{
        this.props.parentCallback(this.state);
    }

    handelFilter = (event) => {
        fetch("http://localhost:8000/api/filter/",{
            method:"POST",
            headers:{
                'Accept': 'application/json',
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                'start-date':this.state.min,
                'finish-date':this.state.max,
                'productId': this.state.idProduct,
                'profileName': this.state.idName
            })
        }).then(response => {
            if (response.status > 400){
                return this.setState(() => {
                    return{ placeholder: "Error" }
                });
            }
            return response.json();
        }).then(data => {
            this.setState(() => {
                return{
                    canti: data['cantidad'],
                    prom: data['promedio'],
                    minval: data['min'],
                    maxval: data['max'],
                    top: data['top'],
                    bot: data['bot'],
                    chart: data['chart'] 
                }
            });


            this.sendData();
        });
    }

    render(){
        return (
            <form>
                <List>
                    <ListItem>
                        <TextField label="Nombre de Usuario" type="search" onChange={this.handleName} />
                    </ListItem>
                    <ListItem>
                        <TextField label="Producto" type="search" onChange={this.handleProduct}/>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <TextField
                                id="date"
                                label="Fecha de inicio"
                                type="date"
                                value={this.state.min}
                                className='textField'
                                onChange = {this.handelBotChange}
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                    </ListItem>
                    <ListItem>
                        <TextField
                                id="date"
                                label="Fecha final"
                                type="date"
                                value={this.state.max}
                                onChange = {this.handelTopChange}
                                className='textField'
                                InputLabelProps={{
                                shrink: true,
                                }}
                            />
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" color="primary" disableElevation onClick={this.handelFilter}>
                            Filtrar
                        </Button>
                    </ListItem>
                </List>
            </form>
        );
        return (
            <div>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography>Buscar</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        <ListItem>
                            <TextField id="standard-search" label="Nombre de Usuario" type="search" />
                        </ListItem>
                        <ListItem>
                            <TextField id="standard-search" label="Producto" type="search" />
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography className= 'accordiontext'>Opcion 3</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    xdxdxdxdxdxd.
                </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion disabled>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
                >
                <Typography>Disabled Accordion</Typography>
                </AccordionSummary>
            </Accordion>
            </div>
        );
    }
}
