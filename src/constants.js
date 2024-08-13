// constants are just references to values (string values here)
 // collected in one place and defined as const
 //
 // You do not have to use constants
 // But done well they:
 // - Make it easier to avoid typos
 // - Help make use of IDE completion
 // - Make it easy if the value changes
 //    - only need to change the value here
 //    - the constant reference doesn't change

 export const LOGIN_STATUS = {
    PENDING: 'pending',
    NOT_LOGGED_IN: 'notLoggedIn',
    IS_LOGGED_IN: 'loggedIn',
  };

  // Might be SERVER_CODES and CLIENT_CODES if we had more and different constants
  export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    REQUIRED_WORD: 'required-word',
  };

  export const CLIENT = {
    NETWORK_ERROR: 'networkError',
    NO_SESSION: 'noSession',
  };

  export const MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again',
    [SERVER.AUTH_INSUFFICIENT]: 'You can not use dog as your user name.',
    [SERVER.REQUIRED_USERNAME]: 'Please enter a valid (letters and/or numbers) username',
    [SERVER.REQUIRED_WORD]: 'Please enter a valid word, digits and letters only',
    default: 'Something went wrong.  Please try again',
  };
