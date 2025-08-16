const data = [
  [1,5.9],[2,8.1],[3,10.4],[4,12.3],[5,15.0],
  [6,17.2],[7,20.1],[8,22.0],[9,25.4],[10,28.1]
];

const eta = 0.01;

// 前 19 步梯度下降初始化
let w = Math.random()*2-1;  // 随机初始化
let b = 0.0;

const steps = [];
const losses = [];

// 计算前 19 步梯度下降轨迹
for(let i=0;i<19;i++){
  let dw=0, db=0, L=0;
  for(let j=0;j<data.length;j++){
    const x = data[j][0], y = data[j][1];
    const y_pred = w*x + b;
    dw += (y_pred - y)*x;
    db += (y_pred - y);
    L += (y_pred - y)**2;
  }
  dw /= data.length;
  db /= data.length;
  L /= 2*data.length;

  // 保存当前步
  steps.push([w,b]);
  losses.push(L);

  // 更新参数
  w -= eta*dw;
  b -= eta*db;
}

// 第20步：直接显示最终收敛
const wFinal = 2.4515, bFinal = 2.9665, lossFinal = 0.082303;
steps.push([wFinal,bFinal]);
losses.push(lossFinal);

// 拟合直线图
const chartLine = Highcharts.chart('container-line',{
  title:{text:'拟合直线'},
  xAxis:{title:{text:'x轴'}, min:0, max:11},
  yAxis:{title:{text:'y轴'}, min:0, max:35},
  series:[
    {type:'scatter',name:'演示数据坐标',data:data, color: 'rgba(119, 152, 191, .5)'},
    {type:'line',name:'拟合直线',data:[],color:'#f45b5b',lineWidth:3, marker: { enabled: false }, enableMouseTracking: false }
  ],
});

// Loss 曲线
const chartLoss = Highcharts.chart('container-loss',{
  title:{text:'损失值曲线'},
  xAxis:{title:{text:'迭代次数'}, min:0, max:20},
  yAxis:{title:{text:'损失值'}, type:'logarithmic', min:0.001, max:30},
  series:[
    {
      type:'area',
      name:'损失值',
      data:[],
      color:'rgba(0,255,0,0.8)',
      fillColor:'rgba(0,255,0,0.2)',
      lineWidth:3,
      marker:{enabled:false},
      legend: {enabled: false },
    }
  ]
});

$('#step-slider').on('input', function(){
    let sliderVal = parseInt(this.value);
    $('#step-value').text(sliderVal);

    // 防止越界
    const idx = Math.min(sliderVal - 1, steps.length - 1);

    const step = steps[idx];
    if(step){
        const [w,b] = step;

        chartLine.series[1].setData([[0,w*0+b],[10,w*10+b]],true);

        const lossSlice = losses.slice(0, idx+1).map((v,i)=>[i+1,v]);
        chartLoss.series[0].setData(lossSlice,true);

        $('#loss-value').text(losses[idx].toFixed(4));
    }
});


// 初始化显示第1步
const [w0,b0] = steps[0];
chartLine.series[1].setData([[0,w0*0+b0],[10,w0*10+b0]],true);
chartLoss.series[0].setData([[1,losses[0]]],true);
$('#loss-value').text(losses[0].toFixed(4));