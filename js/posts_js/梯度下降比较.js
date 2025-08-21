$(function() {
    // 模拟梯度下降的损失值序列
    // 未缩放 (w2系数大)
    let loss_unscaled = [1000, 800, 650, 520, 410, 320, 250, 200, 160, 130, 105, 85, 70, 58, 48, 40, 33, 28, 24, 20];
    // 已缩放 (w2系数与w1相近)
    let loss_scaled = [1000, 600, 360, 216, 130, 78, 47, 28, 17, 10, 6, 3.6, 2.2, 1.3, 0.78, 0.47, 0.28, 0.17, 0.1, 0.06];

    Highcharts.chart('chart', {
        chart: {
            type: 'line'
        },
        title: {
            text: '梯度下降损失收敛对比'
        },
        subtitle: {
            text: '蓝色：未缩放  红色：已缩放'
        },
        xAxis: {
            title: { text: '迭代次数' },
            categories: Array.from({length: loss_unscaled.length}, (_, i) => i+1)
        },
        yAxis: {
            title: { text: '损失值' },
            type: 'logarithmic' // 损失值变化大，用对数更清楚
        },
        series: [{
            name: '未缩放',
            data: loss_unscaled,
            color: 'blue'
        }, {
            name: '已缩放',
            data: loss_scaled,
            color: 'red'
        }],
        tooltip: {
            shared: true,
            valueDecimals: 2
        }
    });
});