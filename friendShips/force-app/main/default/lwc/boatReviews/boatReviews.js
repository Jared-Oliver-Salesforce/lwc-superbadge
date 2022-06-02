// imports
import { LightningElement, api, track } from "lwc";
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    @track boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() { 
        return this.boatId;
    }
    set recordId(value) {
        //sets boatId attribute
        this.boatId = value;
        //sets boatId assignment
        this.setAttribute('boatId', value);
        //get reviews associated with boatId
        this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
        if(this.boatReviews && this.boatReviews.length > 0) {
            return true;
        }
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    refresh() { }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() { 
        if(!this.boatId) {
            return;
        } else {
            this.isLoading = true;

            getAllReviews({ boatId: this.boatId })
                .then((result) => {
                    this.boatReviews = result;
                    this.error = undefined;
                })
                .catch((error)=> {
                    this.error = error;
                    this.boatReviews = undefined;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
        this.userPageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'User',
                actionName: 'home'
            }
        };
    }
}