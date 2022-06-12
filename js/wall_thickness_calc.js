const jsonURL = 'https://api.npoint.io/52a0388ea949b5bd45eb'

async function fetchJson(jsonURL){
    let response = await fetch(jsonURL);
    dataJson = await response.json();
    return dataJson;
}


async function displayJson(){
    let data = await fetchJson(jsonURL)
}

displayJson();

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})

const sizeArrayDN =  [6,8,10,15,20,25,32,40,50,65,80,90,100,125,150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,1050]
const sizeArrayNPS = ['1/8','1/4','3/8','1/2','3/4',1,'1 1/4','1 1/2',2,'2 1/2',3,'3 1/2',4,5,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,42]
const schArray = ['S10','S20','S30','S40','S60','S80','S100','S120','S140','S160','STD','XS','XXS']
const schArrayComplete = ['SCH 10','SCH 20','SCH 30','SCH 40','SCH 60','SCH 80','SCH 100','SCH 120','SCH 140','SCH 160','SCH STD','XS','XXS']
// const sizeArrayDN =  [15,20,25,32,40,50,65,80,90,100,125,150]


let tableData = []

function mainComputeAS() {
    // Get pressure, read units and change to MPa
    let pres = parseFloat(document.getElementById('Pres').value)
    let presElement = document.getElementById('Pres-units')
    let presUnit = presElement[presElement.value].innerHTML

    let fc = parseFloat(document.getElementById('fc').value)
    let ff = parseFloat(document.getElementById('ff').value)
    let fs = parseFloat(document.getElementById('fs').value)
    let f = parseFloat(document.getElementById('f').value)
    let e = parseFloat(document.getElementById('e').value)
    let M = parseFloat(document.getElementById('M').value)
    let W = parseFloat(document.getElementById('W').value)
    let G = parseFloat(document.getElementById('G').value)

    if (pres == 0 || isNaN(pres) || fc == 0 || isNaN(fc) || ff == 0 || isNaN(ff) || fs == 0 || isNaN(fs) || f == 0 || isNaN(f) || e == 0 || isNaN(e) || M == 0 || isNaN(M) || W == 0 || isNaN(W) || isNaN(G)) {
        alert('Please check inputs for errors')
        return
    }

    switch (presUnit) {
        case 'MPa':
        pres = Math.round(pres * 1e4) / 1e4
        break
        case 'kPa':
        pres = Math.round(pres/1000 * 1e4) / 1e4
        break
        case 'bar':
        pres = Math.round(pres/10 * 1e4) / 1e4
        break
        case 'PSI':
        pres = Math.round(pres/145 * 1e4) / 1e4
        break
    }

    let hazardArray = []
    let tfArray = []
    let tmArray = []
    let tnArray = []
    let selectedSchArray = []


    for (let i = 0; i < sizeArrayDN.length; i++) {
        let schFound = false
        let DN = sizeArrayDN[i]

        //hazard
        let hazard = Math.round(pres*DN*fc*fs*ff * 1e2) / 1e2
        
        if (hazard < 10**2.5) {
            hazardArray.push('E')
        } else if (hazard < 10**3) {
            hazardArray.push('D')
        } else if (hazard < 10**4) {
            hazardArray.push('C')
        } else if (hazard < 10**8.5) {
            hazardArray.push('B')
        } else {
            hazardArray.push('A')
        }

        //tf
        let OD = dataJson.Tubing[i].OD_mm
        let tf = Math.round(pres*OD/(2*f*e*M*W+pres) * 1e2) / 1e2
        tfArray.push(tf)
        
        //tm
        let tm = Math.round((tf + G) * 1e2) / 1e2
        tmArray.push(tm)

        //tn
        let tn = Math.round(tm*1.125 * 1e2) / 1e2
        tnArray.push(tn)

        // find SCH for tn
        for (let a = 0; a < schArray.length; a++) {
            if (dataJson.Tubing[i][schArray[a]] >= tn) {
                selectedSchArray.push(schArrayComplete[a])
                schFound = true
                break
            }
        }

        if (schFound == false) {
            selectedSchArray.push('-')
        }
    }

    // Create data dict using arrays

    let data = {}
    let dataArray = []

    for (let i = 0; i < sizeArrayDN.length; i++) {
        data = {}
        data['id'] = i
        data['DN'] = sizeArrayDN[i]
        data['NPS'] = sizeArrayNPS[i]
        data['Hazard'] = hazardArray[i]
        data['tf'] = tfArray[i]
        data['tm'] = tmArray[i]
        data['tn'] = tnArray[i]
        data['sch'] = selectedSchArray[i]

        dataArray.push(data)
    }

    let columns = [
    {title:"DN", field:"DN"},
    {title:"NPS", field:"NPS"},
    {title:"Hazard Value", field:"Hazard"},
    {title:"tf [mm]", field:"tf"},
    {title:"tm [mm]", field:"tm"},
    {title:"tn [mm]", field:"tn"},
    {title:"Schedule", field:"sch"},
    ]

    table.setColumns(columns)
    table.setData(dataArray)
}

const polyArray = [20,25,32,40,50,63,75,90,110,125,140,160,180,200,225,250,280,315,355,400,450,500,560,630,710,800,900,1000,1200,1400,1600,1800,2000]
const polySDR = [41,26,21,17,13.6,11,9,7.4]
const polyPN = [4,6.3,8,10,12.5,16,20,25]

function mainComputePOLIPLEX() {
    let pres = parseFloat(document.getElementById('Pres').value)
    let presElement = document.getElementById('Pres-units')
    let presUnit = presElement[presElement.value].innerHTML

    if (pres == 0 || isNaN(pres)) {
        alert('Please check inputs for errors')
        return
    }

    switch (presUnit) {
        case 'MPa':
        pres = Math.round(pres * 1e4) / 1e4
        break
        case 'kPa':
        pres = Math.round(pres/1000 * 1e4) / 1e4
        break
        case 'bar':
        pres = Math.round(pres/10 * 1e4) / 1e4
        break
        case 'PSI':
        pres = Math.round(pres/145 * 1e4) / 1e4
        break
    }
    
    const S = 8     // design stress
    const p = 0.8   // pressure derating factor

    let tArray = []
    let sdrArray = []
    let pnArray = []

    for (let i = 0; i < dataJson.Poliplex.length; i++) {
        let Dm = dataJson.Poliplex[i]['DN']
        let req_t = Math.round(pres*Dm/(2*S+p) * 1e2) / 1e2
        let tFound = false
        tArray.push(req_t)

        for (let a = 0; a < polySDR.length; a++) {
            let t = dataJson.Poliplex[i][polySDR[a]]

            if (t > req_t) {
                sdrArray.push(polySDR[a])
                pnArray.push(polyPN[a])
                tFound = true
                break
            }
        }

        if (tFound == false) {
            sdrArray.push('-')
            pnArray.push('-')
        }
}


    let data = {}
    let dataArray = []

    for (let i = 0; i < tArray.length; i++) {
        data = {}
        data['id'] = i
        data['DN'] = polyArray[i]
        data['t'] = tArray[i]
        data['SDR'] = sdrArray[i]
        data['PN'] = pnArray[i]

        dataArray.push(data)
    }

    let columns = [
        {title:"DN", field:"DN"},
        {title:"t [mm]", field:"t"},
        {title:"SDR", field:"SDR"},
        {title:"PN", field:"PN"},
    ]

    table.setColumns(columns)
    table.setData(dataArray)
}


document.getElementById('results').innerHTML = `<div id="results-table"></div>`
            
var table = new Tabulator("#results-table", {
    height:0, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data:tableData, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Input values to show results", field:"DN"},
    ],
});

function createTable(type) {
    switch (type) {
        case 'AS':
            document.getElementById('results').innerHTML = `<div id="results-table"></div>`
            
            table = new Tabulator("#results-table", {
                height:700, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
                data:tableData, //assign data to table
                layout:"fitColumns", //fit columns to width of table (optional)
                columns:[ //Define Table Columns
                    {title:"DN", field:"DN"},
                    {title:"NPS", field:"NPS"},
                    {title:"Hazard Value", field:"Hazard"},
                    {title:"tf [mm]", field:"tf"},
                    {title:"tm [mm]", field:"tm"},
                    {title:"tn [mm]", field:"tn"},
                    {title:"Schedule", field:"sch"},
                ],
            });
            break
        
        case 'Poly':
            document.getElementById('results').innerHTML = `<div id="results-table"></div>`
        
            table = new Tabulator("#results-table", {
                height:700, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
                data:tableData, //assign data to table
                layout:"fitColumns", //fit columns to width of table (optional)
                columns:[ //Define Table Columns
                    {title:"DN", field:"DN"},
                    {title:"t", field:"t"},
                    {title:"SDR", field:"SDR"},
                    {title:"PN", field:"PN"},
                ],
            });
    }
}



function selectInput(inputType) {
    switch (inputType) {
        case 'AS': {
            document.getElementById('input-fields').innerHTML = `
            <div class="row d-flex justify-content-center">

            <div class="input-group mb-3 d-inline-flex align-items-center w-auto" > 
                <label class="input-group-text pres-input-wallt" for="Pres-Units">Design Pressure</label>
                <input type="number" step="0.01" class="form-control" max="99999999" min="0" id="Pres" style="max-width: 100px;">
                <select class="form-select " id="Pres-units">
                    <option value="0" selected>MPa</option>
                    <option value="1">kPa</option>
                    <option value="2">bar</option>
                    <option value="3">PSI</option>
                </select>
            </div>
            <div class="d-inline-flex align-items-center w-auto">
                <button class="btn btn-primary mb-3" type="button" onclick="mainComputeAS()">Calculate</button>
            </div>
        </div>
        <hr style="margin: -5px 0 10px 0;">
        <div>
            <div class="row d-flex justify-content-center">
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">Fc</span>
                    <input type="number" step="0.01" id="fc" class="form-control form-factor" value="1">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Compressibility and Mass Factor" data-bs-html="true" data-bs-content="0.1 for vacuum <br/> 1 for liquids <br/> 10 for gas ">?</a>
                </div>
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">Ff</span>
                    <input type="number" step="0.01" id="ff" class="form-control form-factor" value="10">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Contents Factor" data-bs-html="true" data-bs-content="1/3 for non-harmful liquids* <br/> 1 for non-harmful gas <br/> 3 for harmful liquid or gas <br/> 10 for very harmful liquid or gas <br/>1000 for lethal liquid or gas  <br/> <br/> *exceptions apply">?</a>
                </div>
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">Fs</span>
                    <input type="number" step="0.01" id="fs" class="form-control form-factor" value="1.5">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Location or Service Factor" data-bs-html="true" data-bs-content="1 for general conditions <br/> See AS 4343 for exceptions">?</a>
                </div>

                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">f</span>
                    <input type="number" step="0.01" id="f" class="form-control form-factor" value="138">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Material Design Strength [MPa]" data-bs-html="true" data-bs-content="AS 4041 Appendix D <br/> ">?</a>
                </div>
                <div class="input-group mb-3  d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">e</span>
                    <input type="number" step="0.01" id="e" class="form-control form-factor" value="1">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Weld Joint Factor" data-bs-html="true" data-bs-content="AS 4041 Table 3.12.2 or D12">?</a>
                </div>
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">M</span>
                    <input type="number" step="0.01" id="M" class="form-control form-factor" value="1">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Class Design Factor" data-bs-html="true" data-bs-content="AS 4041 Table 3.12.3">?</a>
                </div>

                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">W</span>
                    <input type="number" step="0.01" id="W" class="form-control form-factor" value="1">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Weld Joint Strength Reduction Factor" data-bs-html="true" data-bs-content="AS 4041 Table 3.12.5">?</a>
                </div>
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto">
                    <span class="input-group-text input-factor">G</span>
                    <input type="number" step="0.01" id="G" class="form-control form-factor" value="2">
                    <a tabindex="0" class="btn btn-outline-secondary" role="button" data-bs-placement="top" data-bs-toggle="popover" data-bs-trigger="focus" title="Corrosion and Erosion Allowance [mm]" data-bs-html="true" data-bs-content="Max. amount in millimeters that is allowed to be corroded or eroded">?</a>
                </div> 

            </div>
        </div>`
        popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })
        break
        }
        case 'Poly': {
            document.getElementById('input-fields').innerHTML = `
            <div class="row d-flex justify-content-center">
                <div class="input-group mb-3 d-inline-flex align-items-center w-auto" > 
                    <label class="input-group-text pres-input-wallt" for="Pres-Units">Design Pressure</label>
                    <input type="number" step="0.01" class="form-control" max="99999999" min="0" id="Pres" style="max-width: 100px;">
                    <select class="form-select " id="Pres-units">
                        <option value="0" selected>MPa</option>
                        <option value="1">kPa</option>
                        <option value="2">bar</option>
                        <option value="3">PSI</option>
                    </select>
                </div>
                <div class="d-inline-flex align-items-center w-auto">
                    <button class="btn btn-primary mb-3" type="button" onclick="mainComputePOLIPLEX()">Calculate</button>
                </div>
            </div>
            <hr style="margin: -5px 0 15px 0;">
                <div class="row">
                    <span class="info-text">Values calculated considering: <br> -Overall service coefficient C = 1.25 <br> -Pressure de-rating factor (20-25⁰C) = 0.80 <br> -Material grade = PE100</span>
                </div>
            </div>
            `
            break
        }
    }
}