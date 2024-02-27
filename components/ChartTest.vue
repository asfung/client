<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';


export default {
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Race Bar Chart',
        },
        xAxis: {
          categories: ['African', 'Asian', 'Caucasian', 'Hispanic', 'Other'],
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Population (%)',
          },
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
          },
        },
        series: [
          {
            name: 'Year 1960',
            data: [12.3, 5.8, 75.9, 6.6, 4.8],
          },
          {
            name: 'Year 2018',
            data: [10.7, 4.9, 76.8, 5.3, 4.6],
          },
        ],
      },
    };
  },
};
</script>