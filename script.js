/* =========================
   FULL SCRIPT (FIXED & OPTIMIZED)
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       NAVBAR HIDE ON SCROLL
    ========================= */
    let lastScroll = 0;
    const navbar = document.querySelector(".navbar");
    let ticking = false;

    function handleScroll() {
        if (!navbar) return;

        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = "translateY(-100%)";
            navbar.style.opacity = "0";
        } else {
            navbar.style.transform = "translateY(0)";
            navbar.style.opacity = "1";
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });



    /* =========================
       SMOOTH SCROLL FOR MENU
    ========================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e){
            const targetID = this.getAttribute("href");

            if (targetID.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetID);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });



    /* =========================
       SECTION REVEAL + CTA REVEAL
    ========================= */

    /* ---- Section Reveal ---- */
    const revealOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.section, .detail-hero, .reading-box').forEach(section => {
        section.classList.add('reveal-up');
        sectionObserver.observe(section);
    });


    /* ---- EMAIL CTA REVEAL ---- */
    const ctaSection = document.querySelector(".cta-email");

    if (ctaSection) {
        const ctaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        ctaObserver.observe(ctaSection);
    }

});

let rawParsedData = []; 
let dataHeaders = [];

document.getElementById('fileUpload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        document.getElementById('uploadStatus').style.display = 'inline-block';
        document.getElementById('uploadStatus').innerText = `File Selected: ${this.files[0].name}`;
    }
});

function calculateScale(width) {
    return {
        titleSize: Math.max(16, Math.round(width * 0.022)),
        axisSize: Math.max(12, Math.round(width * 0.016)),
        legendSize: Math.max(10, Math.round(width * 0.014)),
        rightMargin: Math.max(180, width * 0.28) 
    };
}

function liveUpdateDimensions() {
    const plotContainer = document.getElementById('plotContainer');
    if (!plotContainer.data) return; 

    const newWidth = parseInt(document.getElementById('imgWidth').value) || 1000;
    const newHeight = parseInt(document.getElementById('imgHeight').value) || 600;
    const scale = calculateScale(newWidth);

    Plotly.relayout('plotContainer', {
        width: newWidth, height: newHeight,
        'title.text': document.getElementById('graphTitle').value,
        'title.font.size': scale.titleSize,
        'xaxis.title.font.size': scale.axisSize,
        'yaxis.title.font.size': scale.axisSize,
        'legend.font.size': scale.legendSize,
        'margin.r': scale.rightMargin
    });
}

function parseAndLoadData() {
    const fileInput = document.getElementById('fileUpload').files[0];
    const manualData = document.getElementById('manualData').value;

    if (fileInput) {
        const ext = fileInput.name.split('.').pop().toLowerCase();
        if (ext === 'csv') {
            Papa.parse(fileInput, { complete: function(results) { processRawData(results.data); }, skipEmptyLines: true, dynamicTyping: true });
        } else if (ext === 'xlsx' || ext === 'xls') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1});
                processRawData(jsonData);
            };
            reader.readAsArrayBuffer(fileInput);
        }
    } else if (manualData) {
        const parsed = Papa.parse(manualData, { skipEmptyLines: true, dynamicTyping: true }).data;
        processRawData(parsed);
    } else {
        alert("Please select a file or paste data.");
    }
}

function processRawData(data) {
    if (!data || data.length < 2) return alert("Dataset too small or invalid.");
    
    rawParsedData = data;
    let firstRow = data[0];
    dataHeaders = [];

    let hasHeaders = firstRow.some(val => typeof val === 'string');
    
    for (let i = 0; i < firstRow.length; i++) {
        if (hasHeaders && firstRow[i] !== null) {
            dataHeaders.push(firstRow[i].toString().trim());
        } else {
            dataHeaders.push(`Column ${i + 1}`);
        }
    }

    let xHtml = '';
    let yHtml = '';
    dataHeaders.forEach((header, index) => {
        xHtml += `<div class="checkbox-row"><input type="radio" name="xCol" id="xCol_${index}" value="${index}" ${index === 0 ? 'checked' : ''}><label for="xCol_${index}">${header}</label></div>`;
        yHtml += `<div class="checkbox-row"><input type="checkbox" class="yColCheck" id="yCol_${index}" value="${index}" ${index > 0 ? 'checked' : ''}><label for="yCol_${index}">${header}</label></div>`;
    });

    document.getElementById('xColContainer').innerHTML = xHtml;
    document.getElementById('yColContainer').innerHTML = yHtml;

    document.getElementById('xLabel').value = dataHeaders[0];
    document.getElementById('yLabel').value = "Values";

    document.getElementById('columnSelectionArea').classList.add('visible');
}

function generatePlot() {
    if (rawParsedData.length === 0) return alert("Please load data first.");

    const xIndex = parseInt(document.querySelector('input[name="xCol"]:checked').value);
    const yCheckboxes = document.querySelectorAll('.yColCheck:checked');
    if (yCheckboxes.length === 0) return alert("Please select at least one Y-Axis column.");
    
    let selectedYIndices = Array.from(yCheckboxes).map(cb => parseInt(cb.value));
    const fitType = document.getElementById('fitType').value;

    let rawX = [];
    let rawYDatasets = selectedYIndices.map(idx => ({ fullValues: [], name: dataHeaders[idx] }));
    
    let startRow = typeof rawParsedData[0][xIndex] === 'string' ? 1 : 0;

    for (let i = startRow; i < rawParsedData.length; i++) {
        let xVal = rawParsedData[i][xIndex];
        if (typeof xVal === 'number') {
            rawX.push(xVal);
            selectedYIndices.forEach((yIdx, arrPos) => {
                let yVal = rawParsedData[i][yIdx];
                rawYDatasets[arrPos].fullValues.push(typeof yVal === 'number' ? yVal : null);
            });
        }
    }

    const customColors = [
        document.getElementById('color1').value, document.getElementById('color2').value,
        document.getElementById('color3').value, document.getElementById('color4').value, document.getElementById('color5').value
    ];

    const MAX_VISUAL_POINTS = 400; 
    const step = Math.max(1, Math.ceil(rawX.length / MAX_VISUAL_POINTS));
    
    let traces = [];
    let rSquaredText = `<strong>Model Fit Analysis:</strong><br><br>`;

    const xAxisTitle = document.getElementById('xLabel').value;
    const yAxisTitle = document.getElementById('yLabel').value;
    const exportWidth = parseInt(document.getElementById('imgWidth').value) || 1000;
    const exportHeight = parseInt(document.getElementById('imgHeight').value) || 600;
    const scale = calculateScale(exportWidth);

    const regOptions = { precision: 10 };

    rawYDatasets.forEach((yData, index) => {
        let validPairs = [];
        for(let i = 0; i < rawX.length; i++) {
            if(yData.fullValues[i] !== null) validPairs.push([rawX[i], yData.fullValues[i]]);
        }
        if(validPairs.length === 0) return;

        let color = customColors[index % customColors.length];
        
        let visualX = [], visualY = [];
        for (let i = 0; i < validPairs.length; i += step) {
            visualX.push(validPairs[i][0]);
            visualY.push(validPairs[i][1]);
        }

        traces.push({
            x: visualX, y: visualY,
            mode: 'markers', type: 'scatter',
            name: yData.name + ' (Data)',
            marker: { color: color, size: 8, line: { color: '#fff', width: 1.5 }, opacity: 0.9 },
            hovertemplate: `<b>${xAxisTitle}:</b> %{x}<br><b>${yAxisTitle}:</b> %{y}<extra></extra>`
        });

        if (fitType === 'spline') {
            traces.push({
                x: validPairs.map(p => p[0]), y: validPairs.map(p => p[1]),
                mode: 'lines', type: 'scatter',
                name: yData.name + ' (Strict Spline)',
                line: { color: color, width: 2.5, shape: 'spline', smoothing: 1.3 },
                hoverinfo: 'skip'
            });
            rSquaredText += `&bull; <b style="color:${color}">${yData.name}:</b> Perfect Interpolation (No equation generated).<br>`;
        } 
        else {
            let result;
            if (fitType === 'linear') result = regression.linear(validPairs, regOptions);
            else if (fitType === 'poly-2') result = regression.polynomial(validPairs, { order: 2, ...regOptions });
            else if (fitType === 'poly-3') result = regression.polynomial(validPairs, { order: 3, ...regOptions });
            else if (fitType === 'poly-4') result = regression.polynomial(validPairs, { order: 4, ...regOptions });
            else if (fitType === 'exponential') result = regression.exponential(validPairs, regOptions);
            else if (fitType === 'logarithmic') result = regression.logarithmic(validPairs, regOptions);
            else if (fitType === 'power') result = regression.power(validPairs, regOptions);

            let curveX = [], curveY = [];
            let xMin = Math.min(...validPairs.map(p=>p[0]));
            let xMax = Math.max(...validPairs.map(p=>p[0]));
            let curveStep = (xMax - xMin) / 200; 
            
            for(let x = xMin; x <= xMax; x += curveStep) {
                curveX.push(x);
                curveY.push(result.predict(x)[1]);
            }
            
            traces.push({
                x: curveX, y: curveY,
                mode: 'lines', type: 'scatter',
                name: yData.name + ' (Fit)',
                line: { color: color, width: 2.5, dash: 'solid' },
                hoverinfo: 'skip'
            });

            rSquaredText += `&bull; <b style="color:${color}">${yData.name}:</b> R² = ${result.r2} <br><span style="font-family:monospace; font-size:13px; color:#4a5568; margin-left:15px;">Eq: ${result.string}</span><br>`;
        }
    });

    const layout = {
        title: { text: document.getElementById('graphTitle').value, font: { size: scale.titleSize, family: 'Arial', color: '#1a202c', weight: 'bold' } },
        width: exportWidth,
        height: exportHeight,
        plot_bgcolor: "#fafafa", paper_bgcolor: "white",
        margin: { l: 80, r: scale.rightMargin, t: 80, b: 80 }, 
        xaxis: {
            title: { text: xAxisTitle, font: { size: scale.axisSize, weight: 'bold' } },
            showgrid: true, gridcolor: '#edf2f7', zeroline: false, showline: true, linewidth: 2, linecolor: '#2d3748', mirror: 'ticks', ticks: 'inside'
        },
        yaxis: {
            title: { text: yAxisTitle, font: { size: scale.axisSize, weight: 'bold' } },
            showgrid: true, gridcolor: '#edf2f7', zeroline: false, showline: true, linewidth: 2, linecolor: '#2d3748', mirror: 'ticks', ticks: 'inside'
        },
        legend: { 
            orientation: 'v',
            x: 1.02, y: 1, 
            xanchor: 'left', yanchor: 'top',
            bordercolor: '#e2e8f0', borderwidth: 1, bgcolor: '#ffffff',
            font: { size: scale.legendSize } 
        },
        hovermode: 'closest'
    };

    const config = { toImageButtonOptions: { format: 'png', filename: 'advanced_plot', scale: 3 }, displayModeBar: true, displaylogo: false };

    const wrapper = document.getElementById('output-wrapper');
    wrapper.classList.remove('visible'); 

    setTimeout(() => {
        Plotly.newPlot('plotContainer', traces, layout, config).then(() => {
            wrapper.classList.add('visible');
            const rContainer = document.getElementById('r-squared-container');
            rContainer.innerHTML = rSquaredText;
            rContainer.style.display = 'block';
        });
    }, 100);
}
