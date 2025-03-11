// Function to create any specific error
const createError = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
  
    return err;
  };
  
  export default createError;