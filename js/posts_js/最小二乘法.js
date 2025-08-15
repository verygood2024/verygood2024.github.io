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

    // 回归直线参数
    var w = 1;
    var b = 0;

    // 绿色垂线整合成一个 series
    var greenLinesData = [];
    scatterData.forEach(function(p) {
        var x = p[0], y = p[1];
        var yOnLine = w * x + b;
        greenLinesData.push([x, y]);
        greenLinesData.push([x, yOnLine]);
        greenLinesData.push(null); // 分隔每条线段
    });

    var series = [
        { 
            name: '演示数据坐标', 
            type: 'scatter',
            color: 'rgba(119, 152, 191, .5)', 
            data: scatterData
        },
        { 
            name: 'f(x) = wx + b', 
            type: 'line', 
            color: '#e74c3c', 
            marker: { enabled: false }, 
            enableMouseTracking: false, 
            data: [[0,0],[10,10]],
            lineWidth: 2
        },
        { 
            name: '绿色垂线', 
            type: 'line',
            data: greenLinesData,
            color: 'green',
            lineWidth: 1.5,
            dashStyle: 'ShortDot',
            enableMouseTracking: false,
            showInLegend: true,
            marker: { enabled: false }
        }
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

    Highcharts.chart('scatter2', json);
});