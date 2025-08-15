$(function () {
    var pData = [];
    var bceY1 = [], bceY0 = [];
    for (var p = 0.001; p < 1; p += 0.005) {
        pData.push(p.toFixed(3));
        bceY1.push({ y: -Math.log(p), formula: 'BCE(y=1) = -log(p)' });
        bceY0.push({ y: -Math.log(1 - p), formula: 'BCE(y=0) = -log(1-p)' });
    }

    Highcharts.chart('bce-chart', {
        chart: { type: 'spline', backgroundColor: '#f9f9f9' },
        title: { text: '二元交叉熵 (BCE / 对数损失)' },
        xAxis: { 
            categories: pData,
            title: { text: '预测概率 p' }
        },
        yAxis: { 
            title: { text: '损失值' },
            max: 10
        },
        legend: { layout: 'vertical', align: 'left', verticalAlign: 'top', x: 100, y: 70, floating: true, backgroundColor: '#FFFFFF', borderWidth: 1 },
        tooltip: {
            shared: true, // 鼠标悬停同时显示两条曲线
            formatter: function() {
                var s = `<b>预测概率 p: ${this.x}</b><br/>`;
                this.points.forEach(function(point) {
                    s += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y.toFixed(3)}<br/>公式: ${point.point.formula}<br/>`;
                });
                return s;
            }
        },
        series: [
            { name: '真实 = 1', data: bceY1, color: '#f39c12' },
            { name: '真实 = 0', data: bceY0, color: '#2ecc71' }
        ]
    });
});