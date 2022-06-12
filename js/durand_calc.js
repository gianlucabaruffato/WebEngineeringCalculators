const jsonURL = 'https://api.npoint.io/68404205d8a45adcfb9b'
async function fetchJson(jsonURL) {
    let response = await fetch(jsonURL)
    dataJson = await response.json()

    return dataJson
}

async function displayJson(){
    let data = await fetchJson(jsonURL)
}

displayJson()

function linealInterp(X1, Y1, X2, Y2, X) {
    const Y3 = Y1 + (X-X1)*(Y2-Y1)/(X2-X1);
    return parseFloat(Y3);
}

function mainCompute() {
    d50 = parseFloat(document.getElementById('d50').value)
    let cv = parseFloat(document.getElementById('cv').value)

    if (cv < 2 || cv > 15) {
        alert ('ERROR: Cv values out of range (2% ≤ Cv ≤ 15%)')
        return
    }
    if (d50 < 10 || d50 > 2000) {
        alert ('ERROR: d50 values out of range (10 ≤ d50 ≤ 2000)')
        return
    }

    let firstPairValuesDict = []
    let secondPairValuesDict = []
    let firstPairValues = []
    let secondPairValues= []

    for (let i = 0; i < dataJson.durand.length; i++) {
        if (dataJson.durand[i].d >= d50) {
            firstPairValuesDict = dataJson.durand[i]
            secondPairValuesDict = dataJson.durand[i-1]

            if (i == 0) {   // in case d50 = 10 and there's no lower d50 to interpolate
                secondPairValuesDict = {'d':0, 2:0, 5:0, 10:0, 15:0}
            }
            break
        }
    }

    // Dictionary to array
    const dictIndexes = ['d', 2, 5, 10, 15]

    for (let index of dictIndexes) {
        firstPairValues.push(firstPairValuesDict[index])
        secondPairValues.push(secondPairValuesDict[index])
    }

    console.log(firstPairValues, secondPairValues)

    // First interpolation with d50

    let interpolatedArray1 = [d50]

    for (let i = 1; i < 5; i++) {
        interpolatedValue = linealInterp(firstPairValues[0], firstPairValues[i], secondPairValues[0], secondPairValues[i], d50)
        interpolatedValue = Math.round(interpolatedValue * 1e3) / 1e3
        interpolatedArray1.push(interpolatedValue)
    }


    const cvIndexArray = [2, 5, 10, 15]

    for (let i = 1; i < 4; i++) {
        if (cvIndexArray[i] >= cv) {
            let firstCvIndex = i
            let secondCvIndex = i-1

            interpolatedFl = linealInterp(cvIndexArray[firstCvIndex], interpolatedArray1[firstCvIndex+1],
                cvIndexArray[secondCvIndex], interpolatedArray1[secondCvIndex+1], cv)
            
            break
        }
    }

    document.getElementById('durand-result').innerHTML = interpolatedFl.toFixed(3)
    chartAddCurrent(d50, interpolatedFl)
    restoreZoomInCurrent()
}

function createChart() {    
    const labels = [10, 20, 40, 60, 80, 100, 200, 400, 600, 800, 1000, 2000]
    const data = {
        labels: labels,
        datasets: [{
            label: 'Cv = 2%',
            data: [0.1,0.2,0.4,0.544,0.632,0.72,0.93,1.1,1.17,1.206,1.23,1.302],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
            tension: 0.4,
        },{
            label: 'Cv = 5%',
            data: [0.124,0.248,0.496,0.662,0.746,0.83,1.08,1.29,1.375,1.396,1.4,1.35],
            borderColor: 'rgb(97, 68, 156)',
            backgroundColor: 'rgb(97, 68, 156)',
            tension: 0.4,
        },{
            label: 'Cv = 10%',
            data: [0.14,0.28,0.56,0.752,0.856,0.96,1.21,1.42,1.465,1.454,1.43,1.356],
            borderColor: 'rgb(248, 48, 206)',
            backgroundColor: 'rgb(248, 48, 206)',
            tension: 0.4,
        },{
            label: 'Cv = 15%',
            data: [0.148,0.296,0.592,0.792,0.896,1,1.27,1.47,1.505,1.482,1.45,1.362],
            borderColor: 'rgb(11, 191, 138)',
            backgroundColor: 'rgb(11, 191, 138)',
            tension: 0.4,
        },{
            label: 'Current',
            borderColor: 'rgba(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132)'
        }]
    }
    config = {
        type: 'line',
        data: data,
        options: {
            aspectRatio: 1.5,
            scales: {
                'y': {
                    display: true,
                    title: {
                        display: true,
                        text: 'FL',
                        font: {
                            size: 16,
                            weight: 'bold',
                        }
                    }
                },
                'x': {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'd50 [μm]',
                        font: {
                            size: 16,
                            weight: 'bold',
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItems) {
                            return tooltipItems.dataset.label +', ' + tooltipItems.parsed.y + ' FL'
                        },
                        title: function(tooltipTitle) {
                            return 'd50 = ' + tooltipTitle[0].label + ' [μm]'
                        }
                    }
                },
            }
        }
    }
    chart = new Chart(
        document.getElementById('chart'),
        config
    )
}

createChart()

function chartAddCurrent(xCurrent, yCurrent) {
    let dict = {
        annotations: {
            pointCurrent: {
                type: 'point',
                xValue: xCurrent,
                yValue: yCurrent,
                backgroundColor: 'rgba(255, 99, 132)',
                radius: 5
            }
        }
    }

    chart.config.options.plugins.annotation = dict

    chart.update()
}

function zoomInCurrent() {
    try {
        config.options.scales['x'].max = d50*1.35
        config.options.scales['x'].min = d50/1.5
    
        config.options.scales['y'].min = interpolatedFl*0.8
        config.options.scales['y'].max = interpolatedFl*1.2
    
        chart.update()
    } catch {
        restoreZoomInCurrent()
    }
}

function restoreZoomInCurrent() {
    config.options.scales['x'].max = 2000
    config.options.scales['x'].min = 0

    config.options.scales['y'].min = 0
    config.options.scales['y'].max = 1.6

    chart.update()
}