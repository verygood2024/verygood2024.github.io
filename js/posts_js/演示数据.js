document.addEventListener("DOMContentLoaded", function () {
    var chart = { type: 'scatter', zoomType: 'xy' };
    var title = { text: '演示数据' };
    var xAxis = { 
        title: { enabled: true, text: 'x轴' }, 
        startOnTick: true, 
        endOnTick: true, 
        showLastLabel: true 
    };
    var yAxis = { title: { text: 'y轴' } };
    
    var plotOptions = { 
        scatter: { 
            marker: { radius: 5 }, 
            states: { hover: { marker: { enabled: false } } }, 
            tooltip: { 
                headerFormat: '<b>{series.name}</b><br>', 
                pointFormat: 'x：{point.x}<br>y：{point.y}' 
            } 
        } 
    };

    var scatterData = [
        [1,5.9],[2,8.1],[3,10.4],[4,12.3],[5,15.0],
        [6,17.2],[7,20.1],[8,22.0],[9,25.4],[10,28.1]
    ];
    var series = [
        { 
            name: '演示数据坐标', 
            type: 'scatter',
            color: 'rgba(119, 152, 191, .5)', 
            data: scatterData
        },
    ];

    var json = { 
        chart, 
        title, 
        xAxis, 
        yAxis, 
        plotOptions, 
        series, 
        legend: { 
            layout: 'vertical', 
            align: 'left', 
            verticalAlign: 'top', 
            x: 100, 
            y: 70, 
            floating: true, 
            backgroundColor: '#FFFFFF', 
            borderWidth: 1 
        }
    };

    Highcharts.chart('scatter0', json);
});