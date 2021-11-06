const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("nav_overlay");
let open = false;

const change = () => {
  if (!open) {
    hamburger.classList.add("open");
    menu.classList.add("d-flex");
    document.body.classList.add("no-scroll");
  } else {
    hamburger.classList.remove("open");
    menu.classList.remove("d-flex");
    document.body.classList.remove("no-scroll");
  }
  open = !open;
};

hamburger.addEventListener("click", change);

const delay = ms => new Promise(res => setTimeout(res, ms));


const chartColor = 'rgba(118, 231, 255)';
const chartColor2 = 'rgba(255, 63, 128)';
const chartColor3 = 'rgba(239, 245, 66)';
const chartColor4 = 'rgba(66, 245, 150)';
const uiColorLight = "#435063"
const fillSettings = {
  linearGradient: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 1
  },
  stops: [
    [0, "rgba(55, 103, 145, 0.40)"],
    [1, "rgba(0, 145, 234, 0.20)"]
  ]
}
const fillSettings2 = {
  linearGradient: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 1
  },
  stops: [
    [0, "rgba(255, 63, 128, 0.40)"],
    [1, "rgba(255, 63, 128, 0.20)"]
  ]
}
const fillSettings3 = {
  linearGradient: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 1
  },
  stops: [
    [0, "rgba(239, 245, 66, 0.40)"],
    [1, "rgba(239, 245, 66, 0.20)"]
  ]
}
const fillSettings4 = {
  linearGradient: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 1
  },
  stops: [
    [0, "rgba(66, 245, 150, 0.40)"],
    [1, "rgba(66, 245, 150, 0.20)"]
  ]
}

function chartConfig(name) {
  let chartConfig = {
    chart: {
      backgroundColor: 'var(--p2)',
      type: 'line',
      style: {
        color: "#f00"
      },
    },
    exporting: {
      chartOptions: {
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true
            }
          }
        }
      },
      fallbackToExportServer: false
    },
    credits: {
      enabled: false
    },

    title: {
      text: ''
    },

    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: '#C8C3BC',
      labels: {
        style: {
          color: '#fff'
        },
        align: "right",
      },
      allowDecimals: false
    },

    xAxis: {
      labels: {
        style: {
          color: '#fff'
        }
      },
      crosshair: {
        width: 1,
        color: uiColorLight,
        dashStyle: 'shortdot'
      },
      type: 'datetime',
    },

    legend: {
      enabled: true,
      itemStyle: {
        color: '#fff'
      }
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        animation: {
          duration: 1500
        },
        marker: {
          enabled: true
        }
      }
    },

    series: [{
      name: "Total Players", // live
      data: [],
      marker: {
        symbol: 'circle',
      },
      type: 'area',
      color: chartColor,
      fillColor: fillSettings
    }, {
      name: "Realtime Players", // live
      data: [],
      marker: {
        symbol: 'circle',
      },
      type: 'area',
      color: chartColor2,
      fillColor: fillSettings2
    }, {
      name: "Players in Lobbys", // will use ranges
      data: [],
      marker: {
        symbol: 'circle',
      },
      type: 'area',
      color: chartColor3,
      fillColor: fillSettings3
    }, {
      name: "Players Idle", // will use ranges
      data: [],
      marker: {
        symbol: 'circle',
      },
      type: 'area',
      color: chartColor4,
      fillColor: fillSettings4
    }],
  };
  return chartConfig;
}


$(function() {
    chart = (Highcharts.chart("container", chartConfig("Statistics")));
});

function getChartData(time = "24") {
    $('#timeframe-change').text(["Last Hour", "Last 6 Hours", "Last 24 Hours", "Last 48 Hours", "Last Week", "Last Month", "Last Year", "All Time"][[1,6,24,48,168,730,8760,876000].indexOf(time)]);
    $.ajax({
    url: "/api/v1/historical?time="+time,
    method: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    cache: true,
    timeout: 10000,
    success: function (data) {
      chart.series[0].setData(data.amount.map(x => [x.insert_time * 1000, x.total_users]));
      chart.series[1].setData(data.amount.map(x => [x.insert_time * 1000, x.total_realtime]));
      chart.series[2].setData(data.amount.map(x => [x.insert_time * 1000, x.in_lobbys]));
      chart.series[3].setData(data.amount.map(x => [x.insert_time * 1000, x.not_in_lobbys]));
    },
    error: function (jqXHR, textStatus, errorThrown) {}
  });
}
getChartData()

function getLiveData() {
  $.ajax({
    url: "/api/v1/live",
    method: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    cache: true,
    timeout: 10000,
    success: function (data) {
      $("#realtime-player-count").text(`${data.players_online}`);
      $("#realtime-player-count-lobbys").text(`${data.players_in_lobby}`);
    },
    error: function (jqXHR, textStatus, errorThrown) {}
  });
  $.ajax({
    url: "/api/v1/total_users_count",
    method: "GET",
    dataType: "json",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    cache: true,
    timeout: 10000,
    success: function (data) {
      $("#unique-player-count").text(`${data.number}`);
    },
    error: function (jqXHR, textStatus, errorThrown) {}
  });
}

i = 10

function timer() {
  setInterval(async function () {
    if (i == 0) {
      getLiveData();
      $('#updates-in').text(`Refreshing...`);
      i = 10;
    } else {
      $('#updates-in').text(`Updates in ${i} sec.`);
    }
    i--
  }, 1000);
}
timer()
getLiveData()