<!-- <template>
  <div>
    <h1>Grafik Posisi Kerja</h1>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Chart } from 'highcharts-vue';

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Grafik Posisi Kerja',
        },
        xAxis: {
          categories: [],
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Jumlah Pegawai',
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
        series: [],
      },
    };
  },

  computed: {
    ...mapState({
      forcingAllPegawais: state => state.Pegawai.forcingAllPegawai,
    }),

    posisiCount() {
      const posisiCount = {};
      this.forcingAllPegawais.forEach(pegawai => {
        if (posisiCount[pegawai.posisi]) {
          posisiCount[pegawai.posisi]++;
        } else {
          posisiCount[pegawai.posisi] = 1;
        }
      });
      return posisiCount;
    },

    chartData() {
      const categories = Object.keys(this.posisiCount);
      const data = Object.values(this.posisiCount);
      return { categories, data };
    },
  },

  watch: {
    chartData: {
      handler(newData) {
        this.chartOptions.xAxis.categories = newData.categories;
        this.chartOptions.series = [{ data: newData.data }];
      },
      immediate: true,
    },
  },

  methods: {
    async allPegawais(){
      try{
        await this.$store.dispatch('Pegawai/forcingAllPegawai')
      }catch(err){
        console.log(err)
      }
    }
  },

  mounted(){
    this.allPegawais()
  }
};
</script> -->




<template>
  <div>
    <h1>Grafik Posisi Kerja</h1>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Chart } from 'highcharts-vue';

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
        },
        title: {
          // text: 'Grafik Posisi Kerja',
          text: '',
        },
        xAxis: {
          categories: [],
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Jumlah Pegawai',
          },
          allowDecimals: false
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            colorByPoint: true,
          },
        },
        // series: [],
        series: [{
          data: [],
          showInLegend: false, 
        }],

      },

      // chartOptions: {
      //   chart: {
      //     type: 'bar',
      //   },
      //   title: {
      //     text: 'Grafik Posisi Kerja',
      //   },
      //   xAxis: {
      //     categories: [],
      //   },
      //   yAxis: {
      //     min: 0,
      //     title: {
      //       text: 'Jumlah Pegawai',
      //     },
      //   },
      //   legend: {
      //     reversed: true,
      //   },
      //   plotOptions: {
      //     series: {
      //       stacking: 'normal',
      //       colorByPoint: true,
      //     },
      //   },
      //   colors: ['#FF6384', '#36A2EB', '#FFCE56', '#20c997', '#6C7A89'], // Add this line
      //   series: [],
      // },
      
    };
  },

  computed: {
    ...mapState({
      forcingAllPegawais: state => state.Pegawai.forcingAllPegawai,
    }),

    posisiCount() {
      const posisiCount = {};
      this.forcingAllPegawais.forEach(pegawai => {
        if (posisiCount[pegawai.posisi]) {
          posisiCount[pegawai.posisi]++;
        } else {
          posisiCount[pegawai.posisi] = 1;
        }
      });
      return posisiCount;
    },

    chartData() {
      const categories = Object.keys(this.posisiCount);
      const data = Object.values(this.posisiCount);
      return { categories, data };
    },
  },

  watch: {
    chartData: {
      handler(newData) {
        this.chartOptions.xAxis.categories = newData.categories;
        this.chartOptions.series = [{ data: newData.data }];
      },
      immediate: true,
    },
  },

  methods: {
    async allPegawais(){
      try{
        await this.$store.dispatch('Pegawai/forcingAllPegawai')
      }catch(err){
        console.log(err)
      }
    }
  },

  mounted(){
    this.allPegawais()
  }
};
</script>