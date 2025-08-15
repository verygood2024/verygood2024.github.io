$(function () {

    var xData = [];
    for (var x = -5; x <= 5; x += 0.05) {
        xData.push(x.toFixed(2));
    }

    function generateData(delta) {
        var mse = [], mae = [], huber = [];
        var mseMax = 0, maeMax = 0, huberMax = 0;

        for (var i = 0; i < xData.length; i++) {
            var x = parseFloat(xData[i]);
            
            var mseVal = Math.pow(x, 2);
            var maeVal = Math.abs(x);
            var absX = Math.abs(x);
            var huberVal = absX <= delta ? 0.5 * x * x : delta * (absX - 0.5 * delta);

            mse.push(mseVal);
            mae.push(maeVal);
            huber.push(huberVal);

            if (mseVal > mseMax) mseMax = mseVal;
            if (maeVal > maeMax) maeMax = maeVal;
            if (huberVal > huberMax) huberMax = huberVal;
        }

        // 归一化
        var mseData = mse.map(y => ({ y: y / mseMax, formula: 'MSE = (误差)²' }));
        var maeData = mae.map(y => ({ y: y / maeMax, formula: 'MAE = |误差|' }));
        var huberData = huber.map(y => ({ y: y / huberMax, formula: `Huber(δ=${delta})` }));

        return { mseData, maeData, huberData };
    }

    var delta = parseFloat($('#deltaRange').val());
    var initData = generateData(delta);

    var chart = Highcharts.chart('loss-comparison', {
        chart: { type: 'spline', backgroundColor: '#f9f9f9' },
        title: { text: 'MSE / MAE / Huber 损失归一化比较' },
        xAxis: {
            categories: xData,
            title: { text: '预测误差' },
            plotBands: [{
                from: -delta,
                to: delta,
                color: 'rgba(255, 235, 59, 0.3)',
                label: { text: '|x| ≤ δ', style: { color: '#555' }, verticalAlign: 'top', align: 'center' }
            }],
            plotLines: [
                { value: -delta, color: '#f1c40f', width: 2, dashStyle: 'Dash', label: { text: '-δ', style: { color: '#f1c40f' }, align: 'left' } },
                { value: delta, color: '#f1c40f', width: 2, dashStyle: 'Dash', label: { text: 'δ', style: { color: '#f1c40f' }, align: 'right' } }
            ]
        },
        yAxis: { title: { text: '归一化损失值' }, max: 1 },
        legend: { layout: 'vertical', align: 'left', verticalAlign: 'top', x: 100, y: 70, floating: true, backgroundColor: '#FFFFFF', borderWidth: 1 },
        tooltip: {
            shared: true, // 显示三条曲线对比
            formatter: function () {
                var s = `<b>误差: ${this.x}</b><br/>`;
                this.points.forEach(function(point) {
                    s += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y.toFixed(3)}<br/>公式: ${point.point.formula}<br/>`;
                });
                return s;
            }
        },
        series: [
            { name: 'MSE (平方)', data: initData.mseData, color: '#e74c3c' },
            { name: 'MAE (绝对值)', data: initData.maeData, color: '#3498db' },
            { name: `Huber (δ=${delta})`, data: initData.huberData, color: '#9b59b6' }
        ]
    });

    $('#deltaRange').on('input', function() {
        delta = parseFloat($(this).val());
        $('#deltaValue').text(delta.toFixed(1));

        var newData = generateData(delta);
        chart.series[2].update({ name: `Huber (δ=${delta.toFixed(1)})`, data: newData.huberData }, true);

        chart.xAxis[0].update({ 
            plotBands: [{
                from: -delta,
                to: delta,
                color: 'rgba(255, 235, 59, 0.3)',
                label: { text: '|x| ≤ δ', style: { color: '#555' }, verticalAlign: 'top', align: 'center' }
            }],
            plotLines: [
                { value: -delta, color: '#f1c40f', width: 2, dashStyle: 'Dash', label: { text: '-δ', style: { color: '#f1c40f' }, align: 'left' } },
                { value: delta, color: '#f1c40f', width: 2, dashStyle: 'Dash', label: { text: 'δ', style: { color: '#f1c40f' }, align: 'right' } }
            ]
        });
    });

});