const jsonURL = 'https://api.npoint.io/b165a821446e01f49de5'
async function fetchJson(jsonURL) {
    let response = await fetch(jsonURL)
    dataJson = await response.json()

    return dataJson
}

async function displayJson(){
    let data = await fetchJson(jsonURL)
}

displayJson()

const g = 9.81

function diameterInputType(type) {
    if (type == 'DN') {
        document.getElementById('diameter-input').innerHTML = `
        <div class="input-group mb-3">
            <label class="input-group-text" for="D" style="width: 147px;">Choose</label>
            <input type="radio" class="btn-check" name="DN-NPS-toggle" id="DN-toggle" autocomplete="off" checked onclick="diameterInputType('DN')">
            <label class="btn btn-outline-secondary" for="DN-toggle">DN</label>
        
            <input type="radio" class="btn-check" name="DN-NPS-toggle" id="NPS-toggle" autocomplete="off" onclick="diameterInputType('NPS')">
            <label class="btn btn-outline-secondary" for="NPS-toggle">NPS</label>
            <select class="form-select" id="D">
                <option selected>Choose...</option>
                <option value="1">6</option>
                <option value="2">10</option>
                <option value="3">15</option>
                <option value="4">20</option>
                <option value="5">25</option>
                <option value="6">32</option>
                <option value="7">40</option>
                <option value="8">50</option>
                <option value="9">65</option>
                <option value="10">80</option>
                <option value="11">90</option>
                <option value="12">100</option>
                <option value="13">125</option>
                <option value="14">150</option>
                <option value="15">200</option>
                <option value="16">250</option>
                <option value="17">300</option>
                <option value="18">350</option>
                <option value="19">400</option>
                <option value="20">450</option>
                <option value="21">500</option>
                <option value="22">550</option>
                <option value="23">600</option>
                <option value="24">650</option>
                <option value="25">700</option>
                <option value="26">750</option>
                <option value="27">800</option>
                <option value="28">850</option>
                <option value="29">900</option>
                <option value="30">1050</option>
            </select>
        </div>
        `
    } else {
        document.getElementById('diameter-input').innerHTML = `
        <div class="input-group mb-3">
            <label class="input-group-text" for="D" style="width: 147px;">Choose</label>
            <input type="radio" class="btn-check" name="DN-NPS-toggle" id="DN-toggle" autocomplete="off" onclick="diameterInputType('DN')">
            <label class="btn btn-outline-secondary" for="DN-toggle">DN</label>
        
            <input type="radio" class="btn-check" name="DN-NPS-toggle" id="NPS-toggle" autocomplete="off" checked onclick="diameterInputType('NPS')">
            <label class="btn btn-outline-secondary" for="NPS-toggle">NPS</label>
            <select class="form-select" id="D">
                <option selected>Choose...</option>
                <option value="1">1/4</option>
                <option value="2">3/8</option>
                <option value="3">1/2</option>
                <option value="4">3/4</option>
                <option value="5">1</option>
                <option value="6">1 1/4</option>
                <option value="7">1 1/2</option>
                <option value="8">2</option>
                <option value="9">2 1/2</option>
                <option value="10">3</option>
                <option value="11">3 1/2</option>
                <option value="12">4</option>
                <option value="13">5</option>
                <option value="14">6</option>
                <option value="15">8</option>
                <option value="16">10</option>
                <option value="17">12</option>
                <option value="18">14</option>
                <option value="19">16</option>
                <option value="20">18</option>
                <option value="21">20</option>
                <option value="22">22</option>
                <option value="23">24</option>
                <option value="24">26</option>
                <option value="25">28</option>
                <option value="26">30</option>
                <option value="27">32</option>
                <option value="28">34</option>
                <option value="29">36</option>
                <option value="30">42</option>
            </select>
        </div>
        `
    }
}

function mainCompute() {
    let selectionD = document.getElementById('D')
    let D
    try {
        D = selectionD[selectionD.value].innerHTML
    } catch {
        alert('Please check inputs for errors')
        return
    }
    
    indexD = selectionD.value - 1

    let Q_L = document.getElementById('Q_L').value
    originalQ_L = Q_L // to put on graph, before converting units
    let Q_LUnitsSelection = document.getElementById('Q_L-units')
    let Q_LUnits = Q_LUnitsSelection[Q_LUnitsSelection.value].innerHTML

    let h = document.getElementById('h').value
    let hUnitsSelection = document.getElementById('h-units')
    let hUnits = hUnitsSelection[hUnitsSelection.value].innerHTML

    // let ro = document.getElementById('ro').value
    // let roUnitsSelection = document.getElementById('ro-units')
    // let roUnits = roUnitsSelection[roUnitsSelection.value].innerHTML

    let isDN = document.getElementById('DN-toggle').checked

    // Check if inputs are correct
    if (D == 0 || Q_L == 0 || isNaN(Q_L) || h == 0 || isNaN(h)) {
        alert('Please check inputs for errors')
        return
    }
    
    // console.log('Original Units:', Q_L, Q_LUnits, h, hUnits, ro, roUnits)

    // Convert Q_D to m3/s
    switch (Q_LUnits){
        case 'm³/h':
            Q_L = Math.round(Q_L/3600 * 1e4)/1e4
            break
        case 'm³/s':
            Q_L = Math.round(Q_L * 1e4)/1e4
            break
        case 'l/min':
            Q_L = Math.round(Q_L/60000 * 1e4)/1e4
            break
        case 'ft³/s':
            Q_L = Math.round(Q_L/35.315 * 1e4)/1e4
            break
    }

    // Convert h to m
    switch (hUnits){
        case 'm':
            h = Math.round(h * 1e4)/1e4
            break
        case 'ft':
            h = Math.round(h/3.281 * 1e4)/1e4
            break
        case 'in':
            h = Math.round(h/39.37 * 1e4)/1e4
            break
    }

    // // Convert ro to kg/m3
    // switch (roUnits){
    //     case 'kg/m³':
    //         ro = Math.round(ro * 1e4)/1e4
    //         break
    // }

    // console.log('Converted Units:', Q_L, 'm3/s', h, 'm', ro, 'kg/m3')

    if (isDN == true) {
        let pipeProp = _.find(dataJson.Tubing, ['DN', D])
        d = parseFloat(pipeProp.ID_mm/1000)
        J_L = (4*Q_L)/(3.1416*d*d*(Math.sqrt(g*d))).toFixed(4)
    } else {
        let pipeProp = _.find(dataJson.Tubing, ['NPS', D])
        d = parseFloat(pipeProp.ID_mm/1000)
        J_L = (4*Q_L)/(3.1416*d*d*(Math.sqrt(g*d))).toFixed(4)
    }

    // Method 1: Flooded flow
    
    let A_req = Q_L/Math.sqrt(2*g*h)
    let d_req = 2*Math.sqrt(A_req/3.1416)
    let d_req_m = d_req*1000
    
        // find D_req:
    for (let i = 0; i < dataJson.Tubing.length; i++) {
        if (d_req_m <= dataJson.Tubing[i]['DN']) {
            D_flooded = dataJson.Tubing[i]['DN']
            D_flooded_NPS = dataJson.Tubing[i]['NPS']
            break
        }
    }

    h_req = 0.811*(Q_L ** 2)/(g*(d ** 4))           // minimum required head in m
    switch (hUnits){                                // h_req from m to used unit
        case 'm':
            h_req_newUnits = Math.round(h_req * 1e4)/1e4
            break
        case 'ft':
            h_req_newUnits = Math.round(h_req*3.281 * 1e4)/1e4
            break
        case 'in':
            h_req_newUnits = Math.round(h_req*39.37 * 1e4)/1e4
            break
    }

    if (h >= h_req) {
        sufficientHead = 'True'
    } else {
        sufficientHead = 'False'
    }
    
    let J_L_req = Math.sqrt(2*h/d)                       // maximum J_L
    if (J_L < J_L_req) {
        fluxCriteriaSatisfied = 'True'
    } else {
        fluxCriteriaSatisfied = 'False'
    }

    if (sufficientHead == 'True' && fluxCriteriaSatisfied == 'True') {  // is flow criteria satisfied
        floodedFlowSatisfied = 'True'
    } else {
        floodedFlowSatisfied = 'False'
    }


    // Method 2: Unflooded self-venting piping

    let d_req_method2 = ((4*Q_L)/(0.3*3.1416*g**0.5))**0.4
            
  for (let i = 0; i < dataJson.Tubing.length; i++) {          // find D_selfventing:
        if (d_req_method2*1000 <= dataJson.Tubing[i]['DN']) {
            D_selfventing = dataJson.Tubing[i]['DN']
            D_selfventing_NPS = dataJson.Tubing[i]['NPS']
            break
        } else {
            D_selfventing = 'Out of limits'
            D_selfventing_NPS = D_selfventing
        }

    }

    if (D >= D_selfventing) {                                   // is diameter criteria satisfied?
        diameterCriteriaSatisfied = 'True'
    } else {
        diameterCriteriaSatisfied = 'False'
    }
        
    if (J_L < 0.3) {                                            // is sup volumetric flow threshold satisfied?
        fluxThresholdSatisfied = 'True'
    } else {
        fluxThresholdSatisfied = 'False'
    }


    if (diameterCriteriaSatisfied == 'True' && fluxThresholdSatisfied == 'True') {  // is method 2 satisfied?
        selfventingSatisfied = 'True'
    } else {
        selfventingSatisfied = 'False'
    }
    
    replaceResults(J_L, D_flooded, D_flooded_NPS, h_req_newUnits, hUnits, J_L_req, sufficientHead, 
        fluxCriteriaSatisfied, floodedFlowSatisfied, D_selfventing, D_selfventing_NPS, diameterCriteriaSatisfied,
        fluxThresholdSatisfied, selfventingSatisfied)

    summonChart(h, J_L_req, Q_LUnits, indexD, originalQ_L)

}

function replaceResults(J_L, D_flooded, D_flooded_NPS, h_req, hUnits, J_L_req, sufficientHead, 
    fluxCriteriaSatisfied, floodedFlowSatisfied) {

        document.getElementById('results').innerHTML = `
        <h5>General Information</h5>
        Superficial Volumetric Flux = ${J_L.toFixed(4)} <br>
        <br>
        <h5 class="card-header card-header-inter">Flooded Flow Method</h5>
        Required Max. Volumetric Flux = ${J_L_req.toFixed(4)} <br>
        Required Pipe Size (for current h) = DN ${D_flooded} or NPS ${D_flooded_NPS} <br>
        Required Head (for current pipe) = ${h_req.toFixed(4)} ${hUnits}<br>
        <hr/>
        Is sufficient head available? ${sufficientHead} <br>
        Is flux criteria satisfied? ${fluxCriteriaSatisfied} <br>
        <br>
        Is flooded flow criteria satisfied? ${floodedFlowSatisfied} <br>
        <hr/>
        <div>
            <h6>Flooded Flow Graph</h6>
            <span class="info-text">Note: Values in graph are approximate. To get a more precise result, please redo calculations using the approximate values extracted from the graph.</span>
            <canvas id="chart"></canvas>

            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary mt-2 zoom-btn" onclick="zoomInCurrent()">Zoom In Current</button>
                <button type="button" class="btn btn-primary mt-2 zoom-btn" onclick="restoreZoomInCurrent()">Restore Zoom</button>  
            </div>

        </div>
        <h5 class="card-header card-header-inter">Self-venting Flow Method</h5> 
        Required Pipe Size = DN ${D_selfventing} or NPS ${D_selfventing_NPS} <br>
        <hr/>
        Is diameter criteria satisfied? ${diameterCriteriaSatisfied} <br>
        Is flux threshold satisfied? ${fluxThresholdSatisfied} <br>
        <br>
        Is self-venting flow criteria satisfied? ${selfventingSatisfied} <br>
        `
}

// Find MAX Q_L Algorithm:

function findMaxQ_L(current_h, J_L_max) {
    
    // let arrayDN = []
    // let arrayNPS = []
    let arrayMaxQ_L = []

    for (let i = 0; i < 30; i++) {
        let current_d = dataJson.Tubing[i]['ID_mm']/1000

        // Solve for max Q_L based on current h
        // h = 0.811*(Q_L^2)/(g*d^4)

        let Q_L_max_hbased = Math.sqrt((current_h*g*current_d**4)/0.811)

        // Solve for max Q_L based on max J_L
        // J_L = (4*Q_L)/(pi*(d^2)*(g*d)^0.5)

        let Q_L_max_JLbased = J_L_max*3.1416*current_d**2*Math.sqrt(g*current_d)/4

        if (Q_L_max_JLbased < Q_L_max_hbased) {
            Q_L_max = Math.round(Q_L_max_JLbased*1e5)/1e5
        } else {
            Q_L_max = Math.round(Q_L_max_hbased*1e5)/1e5
        }

        arrayMaxQ_L.push(Q_L_max)
    }

    return arrayMaxQ_L

}

function chartUnits(units, arrayMaxQ_L, xCurrent, yCurrent) { // Allows graph to be in DN or NPS, as well as change flow units
    switch (units) {
        case 'm³/h':
            for (let i = 0; i < arrayMaxQ_L.length; i++) {
                arrayMaxQ_L[i] = Math.round(arrayMaxQ_L[i]*3600 * 1e4)/1e4
            }
            break
        case 'm³/s':
            for (let i = 0; i < arrayMaxQ_L.length; i++) {
                arrayMaxQ_L[i] = Math.round(arrayMaxQ_L[i] * 1e4)/1e4
            }
            break
        case 'l/min':
            for (let i = 0; i < arrayMaxQ_L.length; i++) {
                arrayMaxQ_L[i] = Math.round(arrayMaxQ_L[i]*60000 * 1e4)/1e4
            }
            break
        case 'ft³/s':
            for (let i = 0; i < arrayMaxQ_L.length; i++) {
                arrayMaxQ_L[i] = Math.round(arrayMaxQ_L[i]*2118.88 * 1e4)/1e4
            }
            break
    }

    createChart(arrayMaxQ_L, units, xCurrent, yCurrent, Math.round(arrayMaxQ_L[29]*1.1 * 1e1)/1e1)
}

function createChart(arrayMaxQ_L, units, xCurrent, yCurrent, maxPanValue) {
    // const labels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
    
    const labels = [['DN 6', ' NPS 1/4'], ['DN 10', ' NPS 3/8'], ['DN 15',' NPS 1/2'], ['DN 20',' NPS 3/4'], ['DN 25',' NPS 1'], ['DN 32',' NPS 1 1/4'], 
        ['DN 40',' NPS 1 1/2'], ['DN 50',' NPS 2'], ['DN 65',' NPS 2 1/2'], ['DN 80',' NPS 3'], ['DN 90',' NPS 3 1/2'], ['DN 100',' NPS 4'], ['DN 125',' NPS 5'], ['DN 150',' NPS 6'], ['DN 200',' NPS 8'],
        ['DN 250',' NPS 10'], ['DN 300',' NPS 12'], ['DN 350',' NPS 14'], ['DN 400',' NPS 16'], 
        ['DN 450',' NPS 18'], ['DN 500',' NPS 20'], ['DN 550',' NPS 22'], ['DN 600',' NPS 24'], ['DN 650',' NPS 26'], ['DN 700',' NPS 28'], ['DN 750',' NPS 30'], ['DN 800',' NPS 32'], ['DN 850',' NPS 34'], ['DN 900',' NPS 36'], ['DN 1050',' NPS 42']]
    const data = {
        labels: labels,
        datasets: [{
            label: 'Max. Volumetric Flow Rate per Pipe Size',
            data: arrayMaxQ_L,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.25)',
            tension: 0.15,
            fill: true,
            // xAxisID: 'DNaxis',
            // yAxisID: 'QLaxis'
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
            scales: {
                'y': {
                    display: true,
                    title: {
                        display: true,
                        text: units,
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
                            return tooltipItems.parsed.y + ' ' + units
                        }
                    }
                },
                annotation: {
                    annotations: {
                        pointCurrent: {
                            // Indicates the type of annotation
                            type: 'point',
                            xValue: xCurrent,
                            yValue: yCurrent,
                            backgroundColor: 'rgba(255, 99, 132)',
                            radius: 5
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

function summonChart(current_h, J_L_max, units, xCurrent, yCurrent) {
    let chartStatus = Chart.getChart("chart") 
    if (chartStatus != undefined) {  //Destroys existing chart if it exists to draw new one
        chartStatus.destroy()
    }
    arrayMaxQ_L = findMaxQ_L(current_h, J_L_max)
    chartUnits(units, arrayMaxQ_L, xCurrent, yCurrent)
}

function zoomInCurrent() {
    config.options.scales['x'].min = indexD - 2
    config.options.scales['x'].max = indexD + 2
    config.options.scales['y'].min = 0
    
    if (arrayMaxQ_L[indexD] > originalQ_L) {
        config.options.scales['y'].max = Math.round(arrayMaxQ_L[indexD]*1.5 * 1e1)/1e1
    } else {
        config.options.scales['y'].max = Math.round(originalQ_L*1.2 * 1e1)/1e1
    }

    chart.update()
}

function restoreZoomInCurrent() {
    config.options.scales['x'].min = 0
    config.options.scales['x'].max = 29
    config.options.scales['y'].min = 0

    if (config.options.scales['y'].max > originalQ_L) {
        config.options.scales['y'].max = Math.round(arrayMaxQ_L[29]*1.1 * 1e1)/1e1
    } else {
        config.options.scales['y'].max = Math.round(originalQ_L * 1e1)/1e1
    }
    chart.update()
}