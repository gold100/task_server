import {TaskErrorMessage} from "./TaskErrorMessage";

export class ValidationObject{
    isValid: boolean;
    errorMessage: TaskErrorMessage;

    constructor() {
        this.isValid = true;
    }

    setError(taskError: TaskErrorMessage){
        this.isValid = false;
        this.errorMessage = taskError;
    }
}
