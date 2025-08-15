document.addEventListener("DOMContentLoaded", function () {
    var scatterData = [[1,5.9],[2,8.1],[3,10.4],[4,12.3],[5,15.0],
                       [6,17.2],[7,20.1],[8,22.0],[9,25.4],[10,28.1]];

    // 计算最小二乘拟合直线 y = a*x + b
    var n = scatterData.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    scatterData.forEach(function(point){
        sumX += point[0];
        sumY += point[1];
        sumXY += point[0]*point[1];
        sumXX += point[0]*point[0];
    });
    var a = (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX);
    var b = (sumY - a*sumX)/n;

    // 拟合直线数据
    var lineData = [
        [scatterData[0][0], a*scatterData[0][0]+b],
        [scatterData[scatterData.length-1][0], a*scatterData[scatterData.length-1][0]+b]
    ];

    // Highcharts 配置
    Highcharts.chart('scatterContainer', {
        chart: { type: 'scatter', zoomType: 'xy' },
        title: { text: '演示数据' },
        xAxis: { title: { enabled: true, text: 'x轴' }, startOnTick: true, endOnTick: true, showLastLabel: true },
        yAxis: { title: { text: 'y轴' } },
        legend: { layout: 'vertical', align: 'left', verticalAlign: 'top', x: 100, y: 70, floating: true, backgroundColor: '#FFFFFF', borderWidth: 1 },
        plotOptions: {
            scatter: {
                marker: { radius: 5 },
                states: { hover: { marker: { enabled: false } } },
                tooltip: { headerFormat: '<b>{series.name}</b><br>', pointFormat: 'x：{point.x}<br>y：{point.y}' }
            }
        },
        series: [
            { name: "演示数据坐标", color: 'rgba(119, 152, 191, .5)', data: scatterData },
            { type: 'line', name: '拟合直线', color: '#e74c3c', data: lineData, marker: { enabled: false }, enableMouseTracking: false }
        ]
    });
});
