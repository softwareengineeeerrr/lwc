import { LightningElement, track } from 'lwc';

import { notifyParent, isBlank } from 'c/utils';


export default class ProjectConversionForm extends LightningElement {

    @track draftRecord = {};


    handleCancelClick() {
        notifyParent('cancel', true, this);
    }


    handleCreateClick() {
        if (this.validateInputs()) {
            notifyParent('submit', this.draftRecord, this);
        }
    }


    validateInputs() {
        let validityState = true;

        const requiredFields = this.template.querySelectorAll('[data-type="required-field"]');

        requiredFields.forEach(inputField => {
            inputField.reportValidity();

            this.draftRecord[inputField.dataset.fieldName] = inputField.value;

            const valueIsBlank = isBlank(inputField.value);
            validityState = validityState && !valueIsBlank;
        });

        const usualFields = this.template.querySelectorAll('[data-type="usual-field"]');

        usualFields.forEach(inputField => this.draftRecord[inputField.dataset.fieldName] = inputField.value);

        return validityState;
    }

}