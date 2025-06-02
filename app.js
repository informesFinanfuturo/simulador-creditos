// Simulador de Crédito Múltiple con Retanqueo
class CreditSimulator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.generateCreditTable();
    }

    initializeElements() {
        this.numCreditosInput = document.getElementById('numCreditos');
        this.creditosTable = document.getElementById('creditosTable');
        this.calcularBtn = document.getElementById('calcularBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.errorMessages = document.getElementById('errorMessages');
        this.resultadosSection = document.getElementById('resultadosSection');
        this.amortizationTable = document.getElementById('amortizationTable');
        this.totalPeriodos = document.getElementById('totalPeriodos');
        this.montoTotal = document.getElementById('montoTotal');
        this.totalIntereses = document.getElementById('totalIntereses');
        this.totalPagado = document.getElementById('totalPagado');
        this.montoDefecto = document.getElementById('montoDefecto');
        this.seguroVidaDefecto = document.getElementById('seguroVidaDefecto');
        this.interesDefecto = document.getElementById('interesDefecto');
        this.plazoDefecto = document.getElementById('plazoDefecto');
        this.retanqueoDefecto = document.getElementById('retanqueoDefecto');
        this.comisionFondoDefecto = document.getElementById('comisionFondoDefecto');
        this.aplicarDefectosBtn = document.getElementById('aplicarDefectosBtn');
    }

    setupEventListeners() {
        this.numCreditosInput.addEventListener('change', () => {
            this.generateCreditTable();
        });

        this.calcularBtn.addEventListener('click', () => {
            this.calculateSimulation();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetForm();
        });
        if (this.aplicarDefectosBtn) {
            this.aplicarDefectosBtn.addEventListener('click', () => {
                this.aplicarValoresDefecto();
            });
        }

            if (this.seguroVidaDefecto) {
        this.seguroVidaDefecto.addEventListener('input', () => {
            this.actualizarSeguroVidaEnTabla();
        });
    }
    }



generateCreditTable() {
    const numCreditos = parseInt(this.numCreditosInput.value) || 3;
    this.creditosTable.innerHTML = '';

    const montoDefecto = this.montoDefecto ? this.montoDefecto.value : 7000000;
    const seguroVidaDefecto = this.seguroVidaDefecto ? this.seguroVidaDefecto.value : 0.5;
    const interesDefecto = this.interesDefecto ? this.interesDefecto.value : 1.5;
    const plazoDefecto = this.plazoDefecto ? this.plazoDefecto.value : 12;
    const retanqueoDefecto = this.retanqueoDefecto ? this.retanqueoDefecto.value : 6;
    const comisionDefecto = this.comisionFondoDefecto ? this.comisionFondoDefecto.value : 5.0;

    for (let i = 1; i <= numCreditos; i++) {
        const row = document.createElement('tr');
        
        const html = '<td>' + i + '</td>' +
                    '<td><input type="number" id="monto' + i + '" value="' + montoDefecto + '" min="1" step="1000"></td>' +
                    '<td><input type="number" id="seguroVida' + i + '" value="' + seguroVidaDefecto + '" min="0" max="10" step="0.01"></td>' +
                    '<td><input type="number" id="interes' + i + '" value="' + interesDefecto + '" min="0.01" max="100" step="0.01"></td>' +
                    '<td><input type="number" id="plazo' + i + '" value="' + plazoDefecto + '" min="1" max="360" step="1"></td>' +
                    '<td><input type="number" id="retanqueo' + i + '" value="' + retanqueoDefecto + '" min="1" max="360" step="1"></td>' +
                    '<td><input type="number" id="comision' + i + '" value="' + comisionDefecto + '" min="0" step="0.01"></td>';
        
        row.innerHTML = html;
        this.creditosTable.appendChild(row);
    }
}

    validateInputs() {
        const errors = [];
        const numCreditos = parseInt(this.numCreditosInput.value);

        if (numCreditos < 1 || numCreditos > 10) {
            errors.push('El número de créditos debe estar entre 1 y 10');
        }

        for (let i = 1; i <= numCreditos; i++) {
            const monto = parseFloat(document.getElementById(`monto${i}`).value);
            const interes = parseFloat(document.getElementById(`interes${i}`).value);
            const plazo = parseInt(document.getElementById(`plazo${i}`).value);
            const retanqueo = parseInt(document.getElementById(`retanqueo${i}`).value);

            if (!monto || monto <= 0) {
                errors.push(`Crédito ${i}: El monto debe ser mayor a 0`);
            }
            if (!interes || interes <= 0) {
                errors.push(`Crédito ${i}: El interés debe ser mayor a 0`);
            }
            if (!plazo || plazo <= 0) {
                errors.push(`Crédito ${i}: El plazo debe ser mayor a 0`);
            }
            if (!retanqueo || retanqueo <= 0) {
                errors.push(`Crédito ${i}: El retanqueo debe ser mayor a 0`);
            }
            if (retanqueo >= plazo) {
                errors.push(`Crédito ${i}: El retanqueo debe ser menor que el plazo`);
            }
        }

        return errors;
    }

    calculatePMT(monto, tasaMensual, plazo) {
        // Fórmula PMT: Cuota = Monto × tasa / (1 - (1 + tasa)^(-plazo))
        const factor = Math.pow(1 + tasaMensual, -plazo);
        return monto * tasaMensual / (1 - factor);
    }

    calculateSimulation() {
        const errors = this.validateInputs();

        if (errors.length > 0) {
            this.showErrors(errors);
            return;
        }

        this.hideErrors();
        this.showLoading(true);

        try {
            const credits = this.getCreditsData();
            const amortization = this.calculateAmortization(credits);
            this.displayResults(amortization, credits);
        } catch (error) {
            this.showErrors(['Error en el cálculo: ' + error.message]);
        } finally {
            this.showLoading(false);
        }
    }

getCreditsData() {
    const numCreditos = parseInt(this.numCreditosInput.value);
    const credits = [];

    for (let i = 1; i <= numCreditos; i++) {
        const monto = parseFloat(document.getElementById('monto' + i).value);
        const seguroVidaPorcentaje = parseFloat(document.getElementById('seguroVida' + i).value) || 0;
        const comisionPorcentaje = parseFloat(document.getElementById('comision' + i).value) || 0;
        
        credits.push({
            numero: i,
            monto: monto,
            seguroVidaPorcentaje: seguroVidaPorcentaje,
            interes: parseFloat(document.getElementById('interes' + i).value),
            plazo: parseInt(document.getElementById('plazo' + i).value),
            retanqueo: parseInt(document.getElementById('retanqueo' + i).value),
            porcentajeComision: comisionPorcentaje
        });
    }

    return credits;
}


    calculateAmortization(credits) {
        const amortization = [];
        let periodo = 1;
        let totalIntereses = 0;
        let totalPagado = 0;

        for (let i = 0; i < credits.length; i++) {
            const credit = credits[i];
            const tasaMensual = credit.interes / 100;
            const cuota = this.calculatePMT(credit.monto, tasaMensual, credit.plazo);
            let saldo = credit.monto;

            // Determinar cuántos períodos pagar
            const isLastCredit = i === credits.length - 1;
            const periodosAPagar = isLastCredit ? credit.plazo : credit.retanqueo;

            for (let mes = 1; mes <= periodosAPagar; mes++) {
                const saldoInicial = saldo;
                const interesMensual = saldo * tasaMensual;
                const capitalMensual = cuota - interesMensual;
                saldo = Math.max(0, saldo - capitalMensual);

                let observacion = '';
                let rowClass = '';

                if (mes === 1 && i > 0) {
                    observacion = `Nuevo crédito`;
                    rowClass = 'nuevo-credito-row';
                } else if (mes === credit.retanqueo && !isLastCredit) {
                    observacion = `Retanqueo`;
                    rowClass = 'retanqueo-row';
                } else if (isLastCredit && saldo === 0) {
                    observacion = `Último pago`;
                    rowClass = 'final-payment-row';
                }

                amortization.push({
                    periodo: periodo,
                    credito: credit.numero,
                    saldoInicial: saldoInicial,
                    cuota: cuota,
                    interes: interesMensual,
                    capital: capitalMensual,
                    saldoFinal: saldo,
                    observacion: observacion,
                    rowClass: rowClass
                });

                totalIntereses += interesMensual;
                totalPagado += cuota;
                periodo++;

                // Si es el último crédito y el saldo es 0, terminar
                if (isLastCredit && saldo === 0) {
                    break;
                }
            }

            // Si no es el último crédito, transferir saldo al siguiente
            if (!isLastCredit && i + 1 < credits.length) {
                credits[i + 1].monto += saldo;
            }
        }

        return {
            periods: amortization,
            totalPeriodos: periodo - 1,
            totalIntereses: totalIntereses,
            totalPagado: totalPagado
        };
    }

    
displayResults(amortization, credits) {
    // === SECCIÓN 1: MOSTRAR RESUMEN ===
    const montoTotalInicial = credits.reduce((sum, credit) => {
        const originalMonto = credit.numero === 1 ? credit.monto :
            credits.find(c => c.numero === credit.numero).monto;
        return sum + (credit.numero <= credits.length ?
            credits[credit.numero - 1].monto / credits.length : 0);
    }, 0);

    this.totalPeriodos.textContent = amortization.totalPeriodos;
    this.montoTotal.textContent = this.formatCurrency(credits[0].monto * credits.length);
    this.totalIntereses.textContent = this.formatCurrency(amortization.totalIntereses);
    this.totalPagado.textContent = this.formatCurrency(amortization.totalPagado);

    // === SECCIÓN 2: LIMPIAR TABLA ===
    this.amortizationTable.innerHTML = '';

this.amortizationTable.innerHTML = '';

    const creditosPrimerAparicion = new Map();
    
    // Primer pase: identificar primera aparición
    amortization.periods.forEach((period, index) => {
        let creditoNumero = 0;
        if (period.credito) {
            const creditoStr = String(period.credito);
            let match = creditoStr.match(/Crédito\s*(\d+)/i) || 
                       creditoStr.match(/(\d+)/) ||
                       creditoStr.match(/Credit\s*(\d+)/i);
            creditoNumero = match ? parseInt(match[1] || match[0]) : 0;
        }
        
        if (creditoNumero > 0 && !creditosPrimerAparicion.has(creditoNumero)) {
            creditosPrimerAparicion.set(creditoNumero, index);
        }
    });

    // Segundo pase: generar tabla con seguro de vida
    amortization.periods.forEach((period, index) => {
        const row = document.createElement('tr');
        if (period.rowClass) {
            row.className = period.rowClass;
        }

        // Extraer número de crédito
        let creditoNumero = 0;
        if (period.credito) {
            const creditoStr = String(period.credito);
            let match = creditoStr.match(/Crédito\s*(\d+)/i) || 
                       creditoStr.match(/(\d+)/) ||
                       creditoStr.match(/Credit\s*(\d+)/i);
            creditoNumero = match ? parseInt(match[1] || match[0]) : 0;
        }

        const esPrimerPeriodo = creditosPrimerAparicion.get(creditoNumero) === index;
        const creditoData = credits.find(c => c.numero === creditoNumero);
        
        // Calcular seguro de vida basado en el saldo inicial
        let seguroVida = 0;
        if (creditoData && creditoData.seguroVidaPorcentaje) {
            seguroVida = period.saldoInicial * (creditoData.seguroVidaPorcentaje / 100);
        }

        // Calcular cuota total (cuota base + seguro de vida)
        const cuotaTotal = period.cuota + seguroVida;

        // Calcular comisión F.G.
        let comisionFG = 0;
        if (esPrimerPeriodo && creditoData) {
            const porcentajeComision = parseFloat(document.getElementById(`comision${creditoNumero}`).value) || 0;
            comisionFG = creditoData.monto * (porcentajeComision / 100);
        }

        const comisionTexto = comisionFG > 0 ? this.formatCurrency(comisionFG) : '';

        row.innerHTML = `
            <td>${period.periodo}</td>
            <td>${period.credito}</td>
            <td class="currency">${this.formatCurrency(period.saldoInicial)}</td>
            <td class="currency">${this.formatCurrency(period.cuota)}</td>
            <td class="currency" style="color:#e67e22;">${this.formatCurrency(seguroVida)}</td>
            <td class="currency" style="font-weight:bold;color:#2c3e50;">${this.formatCurrency(cuotaTotal)}</td>
            <td class="currency">${this.formatCurrency(period.interes)}</td>
            <td class="currency">${this.formatCurrency(period.capital)}</td>
            <td class="currency ${period.saldoFinal === 0 ? 'highlight-cell' : ''}">${this.formatCurrency(period.saldoFinal)}</td>
            <td>${period.observacion ? `<span class="status-badge">${period.observacion}</span>` : ''}</td>
            <td class="currency" style="font-weight:bold;${esPrimerPeriodo ? '' : ''}">
                ${comisionTexto}
            </td>
        `;

        this.amortizationTable.appendChild(row);
    });

    this.resultadosSection.classList.remove('hidden');
    this.resultadosSection.scrollIntoView({ behavior: 'smooth' });
}



    getStatusClass(observacion) {
        if (observacion.includes('Retanqueo')) return 'status-badge--retanqueo';
        if (observacion.includes('Nuevo crédito')) return 'status-badge--nuevo';
        if (observacion.includes('Último pago')) return 'status-badge--final';
        return '';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showErrors(errors) {
        this.errorMessages.innerHTML = errors.map(error =>
            `<div>• ${error}</div>`
        ).join('');
        this.errorMessages.classList.remove('hidden');
    }

    hideErrors() {
        this.errorMessages.classList.add('hidden');
    }

    showLoading(show) {
        if (show) {
            this.calcularBtn.classList.add('loading');
            this.calcularBtn.disabled = true;
        } else {
            this.calcularBtn.classList.remove('loading');
            this.calcularBtn.disabled = false;
        }
    }

    resetForm() {
        this.numCreditosInput.value = 3;
        if (this.montoDefecto) this.montoDefecto.value = 7000000;
        if (this.seguroVidaDefecto) this.seguroVidaDefecto.value = 0.5;
        if (this.interesDefecto) this.interesDefecto.value = 1.5;
        if (this.plazoDefecto) this.plazoDefecto.value = 12;
        if (this.retanqueoDefecto) this.retanqueoDefecto.value = 6;
        if (this.comisionFondoDefecto) this.comisionFondoDefecto.value = 5.0;
        this.generateCreditTable();
        this.hideErrors();
        this.resultadosSection.classList.add('hidden');
    }

aplicarValoresDefecto() {
    var numCreditos = parseInt(this.numCreditosInput.value) || 3;
    var montoDefecto = this.montoDefecto ? this.montoDefecto.value : 7000000;
    var seguroVidaDefecto = this.seguroVidaDefecto ? this.seguroVidaDefecto.value : 0.5;
    var interesDefecto = this.interesDefecto ? this.interesDefecto.value : 1.5;
    var plazoDefecto = this.plazoDefecto ? this.plazoDefecto.value : 12;
    var retanqueoDefecto = this.retanqueoDefecto ? this.retanqueoDefecto.value : 6;
    var comisionDefecto = this.comisionFondoDefecto ? this.comisionFondoDefecto.value : 5.0;

    for (var i = 1; i <= numCreditos; i++) {
        var montoInput = document.getElementById('monto' + i);
        var seguroVidaInput = document.getElementById('seguroVida' + i);
        var interesInput = document.getElementById('interes' + i);
        var plazoInput = document.getElementById('plazo' + i);
        var retanqueoInput = document.getElementById('retanqueo' + i);
        var comisionInput = document.getElementById('comision' + i);

        if (montoInput) { montoInput.value = montoDefecto; }
        if (seguroVidaInput) { seguroVidaInput.value = seguroVidaDefecto; }
        if (interesInput) { interesInput.value = interesDefecto; }
        if (plazoInput) { plazoInput.value = plazoDefecto; }
        if (retanqueoInput) { retanqueoInput.value = retanqueoDefecto; }
        if (comisionInput) { comisionInput.value = comisionDefecto; }
    }
}

}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CreditSimulator();
});

// Funciones de utilidad adicionales
function exportToCSV() {
    const table = document.querySelector('.amortization-table');
    if (!table) return;

    let csv = '';
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col => {
            return '"' + col.textContent.replace(/"/g, '""') + '"';
        });
        csv += rowData.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortizacion_credito.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}




// Agregar función de exportación si es necesario
if (typeof window !== 'undefined') {
    window.exportToCSV = exportToCSV;
}