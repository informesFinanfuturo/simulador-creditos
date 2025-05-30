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
    }

    generateCreditTable() {
        const numCreditos = parseInt(this.numCreditosInput.value) || 3;
        this.creditosTable.innerHTML = '';

        for (let i = 1; i <= numCreditos; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td><input type="number" id="monto${i}" value="1000000" min="1" step="1000"></td>
                <td><input type="number" id="interes${i}" value="1.5" min="0.01" max="100" step="0.01"></td>
                <td><input type="number" id="plazo${i}" value="12" min="1" max="360" step="1"></td>
                <td><input type="number" id="retanqueo${i}" value="6" min="1" max="360" step="1"></td>
            `;
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
            credits.push({
                numero: i,
                monto: parseFloat(document.getElementById(`monto${i}`).value),
                interes: parseFloat(document.getElementById(`interes${i}`).value),
                plazo: parseInt(document.getElementById(`plazo${i}`).value),
                retanqueo: parseInt(document.getElementById(`retanqueo${i}`).value)
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
                    observacion = `Nuevo crédito con saldo acumulado`;
                    rowClass = 'new-credit-row';
                } else if (mes === credit.retanqueo && !isLastCredit) {
                    observacion = `Retanqueo - Saldo se transfiere al siguiente crédito`;
                    rowClass = 'retanqueo-row';
                } else if (isLastCredit && saldo === 0) {
                    observacion = `Último pago - Crédito liquidado`;
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
        // Mostrar resumen
        const montoTotalInicial = credits.reduce((sum, credit) => {
            // Solo contar el monto original, no el acumulado
            const originalMonto = credit.numero === 1 ? credit.monto : credits.find(c => c.numero === credit.numero).monto;
            return sum + (credit.numero <= credits.length ? credits[credit.numero - 1].monto / credits.length : 0);
        }, 0);

        this.totalPeriodos.textContent = amortization.totalPeriodos;
        this.montoTotal.textContent = this.formatCurrency(credits[0].monto * credits.length);
        this.totalIntereses.textContent = this.formatCurrency(amortization.totalIntereses);
        this.totalPagado.textContent = this.formatCurrency(amortization.totalPagado);

        // Mostrar tabla de amortización
        this.amortizationTable.innerHTML = '';
        amortization.periods.forEach(period => {
            const row = document.createElement('tr');
            if (period.rowClass) {
                row.className = period.rowClass;
            }

            row.innerHTML = `
                <td>${period.periodo}</td>
                <td>${period.credito}</td>
                <td class="currency">${this.formatCurrency(period.saldoInicial)}</td>
                <td class="currency">${this.formatCurrency(period.cuota)}</td>
                <td class="currency">${this.formatCurrency(period.interes)}</td>
                <td class="currency">${this.formatCurrency(period.capital)}</td>
                <td class="currency ${period.saldoFinal === 0 ? 'highlight-cell' : ''}">${this.formatCurrency(period.saldoFinal)}</td>
                <td>${period.observacion ? `<span class="status-badge ${this.getStatusClass(period.observacion)}">${period.observacion}</span>` : ''}</td>
            `;

            this.amortizationTable.appendChild(row);
        });

        // Mostrar sección de resultados
        this.resultadosSection.classList.remove('hidden');
        this.resultadosSection.scrollIntoView({ behavior: 'smooth' });
    }

    getStatusClass(observacion) {
        if (observacion.includes('Retanqueo')) {
            return 'status-warning';
        } else if (observacion.includes('Nuevo crédito')) {
            return 'status-info';
        } else if (observacion.includes('Último pago')) {
            return 'status-success';
        }
        return '';
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    showErrors(errors) {
        this.errorMessages.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        this.errorMessages.classList.remove('hidden');
    }

    hideErrors() {
        this.errorMessages.innerHTML = '';
        this.errorMessages.classList.add('hidden');
    }

    showLoading(isLoading) {
        this.calcularBtn.disabled = isLoading;
        this.calcularBtn.textContent = isLoading ? 'Calculando...' : 'Calcular Simulación';
    }

    resetForm() {
        this.numCreditosInput.value = 3;
        this.generateCreditTable();
        this.hideErrors();
        this.resultadosSection.classList.add('hidden');
    }
}

// Inicializar el simulador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new CreditSimulator();
});
