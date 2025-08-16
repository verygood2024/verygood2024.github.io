// 生成函数 y = x^2
function generateFunctionData() {
    let data = [];
    for (let x = -5; x <= 5; x += 0.1) {
        data.push([x, x * x]);
    }
    return data;
}

// 梯度下降函数：返回所有迭代点，包括起点
function gradientDescentPoints(startX, learningRate, iterations) {
    let points = [[startX, startX*startX]]; // 迭代0的起点
    let x = startX;
    for (let i = 0; i < iterations; i++) {
        let grad = 2 * x;       // f'(x) = 2x
        x = x - learningRate * grad;
        points.push([x, x*x]);
    }
    return points;
}

$(function () {
    let funcData = generateFunctionData();
    let startX = 4.5;
    let learningRate = 0.2;

    // 初始化 Highcharts
    let chart = Highcharts.chart('container', {
        title: { text: '梯度下降可视化' },
        xAxis: { title: { text: 'x轴' } },
        yAxis: { title: { text: 'y轴' } },
        legend: { enabled: true },
        series: [
            {
                name: '函数 y = x²',
                type: 'line',
                data: funcData,
                marker: { enabled: false },
                color: '#7cb5ec'
            },
            {
                name: '梯度下降路径',
                type: 'line',
                data: gradientDescentPoints(startX, learningRate, 0), // 初始只显示起点
                color: '#f45b5b',
                marker: { symbol: 'circle', radius: 4, fillColor: '#f45b5b' }
            }
        ],
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
    });

    // 滑动条事件：控制迭代次数
    $('#deltaRange').on('input', function () {
        let iterations = parseInt($(this).val());
        $('#deltaValue').text(iterations);

        let points = gradientDescentPoints(startX, learningRate, iterations);

        // 直接更新数据，不做逐步动画 → 高响应，点不会消失
        chart.series[1].setData(points, true);
    });
});