import { LightningElement, api, track, wire} from "lwc";
import { getRecord } from 'lightning/uiRecordApi';

import { showToast, notifyParent } from 'c/utils';

import successLabel from '@salesforce/label/c.Assignment_is_created';
import headerLabel from '@salesforce/label/c.NewAssignmentCreationHeader';
import saveLabel from '@salesforce/label/c.TimeTrackerSaveButton';
import cancelLabel from '@salesforce/label/c.TimeTrackerCancelButton';

export default class AssignmentCreationForm extends LightningElement {

    @api recordId;
    @track currentEmployeeId;
    @track defaultEmployeeGroupId;

    @track renderSpinner = false;

    labels = {
        headerLabel,
        saveLabel,
        cancelLabel,
        successLabel
    }

    @wire(getRecord, { recordId: '$recordId', fields: ['ProjectTask__c.RemainingEstimatedTime__c'] })
    projectTaskRecord;

    @wire(getRecord, { recordId: '$currentEmployeeId', fields: ['Employee__c.EmployeeGroup__c'] })
    employee({ error, data }) {
        if (data) {
            if (this.defaultEmployeeGroupId != data.fields.EmployeeGroup__c.value) {
                this.defaultEmployeeGroupId = data.fields.EmployeeGroup__c.value; 
                
                const employeeInputField = this.template.querySelector(".EmployeeGroup");
                employeeInputField.reset();
            }
        } else if (error) {
            showToast(this, 'Error', error.message, null, 'error', null);
        }
    }
    
    handleChange(event) {
        if (this.currentEmployeeId != event.target.value) {
            this.renderSpinner = true;

            this.currentEmployeeId = event.target.value;
        }
        this.renderSpinner = false;
    }

    handleSubmit() {
        this.renderSpinner = true;
    }

    handleError(event) {
        this.renderSpinner = false;
        showToast(this, 'Error', event.detail.detail, null, 'error', null);
    }

    handleSuccess() {    
        showToast(this, "Success", this.labels.successLabel, null, 'success', null);         
        notifyParent('close', true, this);
    }
    
    handleClose() {
        notifyParent('close', true, this);
    }
}