import React, {Component} from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Grid } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ApexChart from "./MultiAxisChart.js";

export default class ContentBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            cantidad: 0,
            promedio: 0,
            min:0,
            max:0,
            top: [],
            bot: [],
            chart:[]
        };
    }

    componentDidMount(){
        this.setState(()=>{
            return{
                bot: this.props.bot,
                top: this.props.top,
                chart: this.props.chart
            };
        });

    }

    createData(data) {
        if (data != undefined){
            return { productcol: data[0], usercol:data[1], score: data[2], Helpfulness: data[3], summary: data[4] };
        }
        else return{productcol: '0', usercol:'0', score: '0', Helpfulness: '0', summary: '0'}
    }

    transformAll(container){
        var i;
        const newGroup = [];

        for(i=0; i< 10; i++){
            newGroup.push(this.createData(container[i]));
        }
        return newGroup;
    }

    render(){
        console.log(this.props.chart);
        return (
            <Grid container spacing={2}>
                    <Grid item xs = {12}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary">
                                Cantidad Usuarios:
                                </Typography>
                                <Typography id="cantidad" variant="body1" component="p">
                                {
                                    this.props.dataFromParent.canti
                                }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {12}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary">
                                Score Promedio:
                                </Typography>
                                <Typography id="promedio" variant="body1" component="p">
                                {this.props.dataFromParent.prom}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {6}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary">
                                Score minimo:
                                </Typography>
                                <Typography id="min" variant="body1" component="p">
                                {this.props.dataFromParent.minval}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {6}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary">
                                Score Max:
                                </Typography>
                                <Typography id="max" variant="body1" component="p">
                                {this.props.dataFromParent.maxval}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {12}>
                        <Card>
                            <CardContent>
                            <Typography color="textSecondary">
                                Top 10 mas alto:
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>ProductId</TableCell>
                                        <TableCell align="right">Profile name</TableCell>
                                        <TableCell align="right">score</TableCell>
                                        <TableCell align="right">Helpfulness</TableCell>
                                        <TableCell align="right">summary</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {this.transformAll(this.props.top).map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.productcol}
                                        </TableCell>
                                        <TableCell align="right">{row.usercol}</TableCell>
                                        <TableCell align="right">{row.score}</TableCell>
                                        <TableCell align="right">{row.Helpfulness}</TableCell>
                                        <TableCell align="right">{row.summary}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {12}>
                        <Card>
                            <CardContent>
                            <Typography color="textSecondary">
                                Top 10 mas bajo:
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>ProductId</TableCell>
                                        <TableCell align="right">Profile name</TableCell>
                                        <TableCell align="right">score</TableCell>
                                        <TableCell align="right">Helpfulness</TableCell>
                                        <TableCell align="right">summary</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {this.transformAll(this.props.bot).map((row) => (
                                        <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.productcol}
                                        </TableCell>
                                        <TableCell align="right">{row.usercol}</TableCell>
                                        <TableCell align="right">{row.score}</TableCell>
                                        <TableCell align="right">{row.Helpfulness}</TableCell>
                                        <TableCell align="right">{row.summary}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs = {12}>
                        <Card>
                            <CardContent>
                                <ApexChart chart={this.state.chart}></ApexChart>
                            </CardContent>
                        </Card>
                    </Grid>
            </Grid>
          );
    }
}
