import { LightningElement, track } from 'lwc';

import { notifyParent } from 'c/utils';


export default class DatePicker extends LightningElement {

    @track selectedMonth;
    @track selectedYear;


    connectedCallback() {
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;
        
        this.notifyAboutDateSelection();
    }

    renderedCallback() {
        this.template.querySelector(`[data-value="${this.selectedMonth}"]`).classList.add('selected-option');
        this.template.querySelector(`[data-value="${this.selectedYear}"]`).classList.add('selected-option');
    }


    get selectedMonthLabel() {
        return this.monthsOptions.find(month => month.value === this.selectedMonth).label;
    }


    get currentYear() {
        return new Date().getFullYear();
    }

    get currentMonth() {
        return new Date().toLocaleString('en-US', { month: 'numeric' });
    }

    get monthsOptions() {
        const months = [
            { label: 'January', value: '1' },
            { label: 'February', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'August', value: '8' },
            { label: 'September', value: '9' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' }
        ];

        return months;
    }

    get yearsOptions() {
        let years = [];
        const initialYear = this.currentYear - 40;

        for (let i = 0; i < 101; i++) {
            years.push(initialYear + i);
        }

        return years;
    }


    handleRenderingOptionsSelector(event) {
        const sourceSelector = event.currentTarget.dataset.type;
        const oppositeSelector = event.currentTarget.dataset.oppositeType;

        const affectedOptionsSelector = this.template.querySelector(`[data-id="${sourceSelector}-options"]`);
        const oppositeOptionsSelector = this.template.querySelector(`[data-id="${oppositeSelector}-options"]`);
        
        affectedOptionsSelector.classList.add('slds-show');
        affectedOptionsSelector.classList.remove('slds-hide');

        oppositeOptionsSelector.classList.add('slds-hide');
        oppositeOptionsSelector.classList.remove('slds-show');

        if (sourceSelector === 'month-selector') {
            this.template.querySelector(`[data-value="${this.selectedMonth}"]`).scrollIntoView();
        } else {
            this.template.querySelector(`[data-value="${this.selectedYear}"]`).scrollIntoView();
        }
    }

    handleOptionSelection(event) {
        const selectorType = event.currentTarget.dataset.type;

        if (selectorType === 'Month') {
            this.template.querySelector(`[data-value="${this.selectedMonth}"]`).classList.remove('selected-option');
        } else {
            this.template.querySelector(`[data-value="${this.selectedYear}"]`).classList.remove('selected-option');
        }

        this[`selected${selectorType}`] = event.currentTarget.dataset.value;
        event.currentTarget.classList.add('selected-option');

        this.handleClosingOptionsSelector();
        this.notifyAboutDateSelection();
    }

    handleClosingOptionsSelector() {
        this.template.querySelectorAll(`.options-selector`).forEach(selector => {
            selector.classList.add('slds-hide');
            selector.classList.remove('slds-show');
        });
    }

    notifyAboutDateSelection() {
        notifyParent('selection', { month: this.selectedMonth, year: this.selectedYear }, this);
    }

}