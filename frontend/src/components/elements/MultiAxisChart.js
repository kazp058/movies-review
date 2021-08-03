import Chart from "react-apexcharts";
import React from "react";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      score : [0],
      help : [0],
      years: [0],
      series: [
        {
          name: "Score",
          type: "line",
          data: this.score,
        },
        {
          name: "Helpfulness",
          type: "line",
          data: this.help,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "line",
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: { 
          width: [1, 1, 4],
        },
        title: {
          text: "Fecha VS promedio Score y promedio Helpfulness",
          align: "left",
          offsetX: 110,
        },
        xaxis: {
          categories: this.years,
        },
        yaxis: [
          {
            axisTicks: {
              show: true, 
            },
            axisBorder: {
              show: true,
              color: "#008FFB",
            },
            labels: {
              style: {
                colors: "#008FFB",
              },
            },
            title: {
              text: "Promedio Score",
              style: {
                color: "#008FFB",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: "Score",
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#00E396",
            },
            labels: {
              style: {
                colors: "#00E396",
              },
            },
            title: {
              text: "Promedio Helpfulness",
              style: {
                color: "#00E396",
              },
            },
            seriesName: "Helpfulness",
          },

        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
    };
  }

  componentDidMount(){
    console.log(this.props.chart)
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
}
