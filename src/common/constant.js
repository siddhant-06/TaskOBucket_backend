// This file contains all the constants used in the application
export const constants = {
  //Auth related constants
  Auth: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Invalid email or password',
    USER_NOT_FOUND: 'User does not exist',
    PASSWORD_INCORRECT: 'Incorrect password',
    USER_NOT_ACTIVATED:
      'Your account is not activated yet. Please accept the invitation.',
    FORGOT_PASSWORD_SUCCESS: 'Password reset link sent to email',
    RESET_PASSWORD_SUCCESS: 'Password reset successfully',
    RESET_TOKEN_INVALID: 'Invalid or expired token',
    SERVER_ERROR: 'Internal Server Error',
  },
  //User related constants
  User: {
    USER_CREATED: 'User created successfully',
    USER_NOT_CREATED: 'User creation failed',
    USER_FETCHED: 'User fetched successfully',
    USER_LISTED: 'User listing successfully',
    USER_NOT_FOUND: 'User not found',
    USER_UPDATED: 'User updated successfully',
    USER_NOT_UPDATED: 'User update failed',
    USER_DELETED: 'User deleted successfully',
    USER_NOT_DELETED: 'User deletion failed',
    USER_ALREADY_EXISTS: 'User already exists',
    SERVER_ERROR: 'Internal Server Error',
    USER_ID_REQUIRED: 'User ID is required',
    USER_FOUND: 'User found successfully',
    NO_DATA_PROVIDED: 'No data provided to update',
    USER_ID_ARRAY_REQUIRED: 'User IDs array required',

    // Invite flow
    ONLY_ADMIN_CAN_INVITE: 'Only organization admin can invite users',
    USER_ALREADY_IN_ORG: 'User already belongs to another organization',
    USER_ALREADY_INVITED: 'User already invited',
    USER_INVITE_SENT: 'Invitation email sent successfully',
    USER_INVITE_FAILED: 'Failed to send user invitation',
    INVALID_INVITE_TOKEN: 'Invalid or expired invite token',
    PASSWORD_MISMATCH: 'Password and confirm password do not match',
    INVITE_ACCEPTED: 'Invitation accepted successfully',
    ACCEPT_INVITE_FAILED: 'Failed to accept invitation',
    USER_ALREADY_INVITED: 'User has already been invited',
  },

  //Organization related constants
  Organization: {
    ORG_CREATED: 'Organization created successfully',
    ORG_NOT_CREATED: 'Organization creation failed',
    ORG_KEY_EXISTS: 'Organization key already exists',
    ORG_ALREADY_ASSIGNED: 'User already belongs to an organization',
    ORG_NOT_FOUND: 'Organization not found',
    ORG_ID_REQUIRED: 'Organization ID is required',
    ORG_FETCHED: 'Organization fetched successfully',
    SERVER_ERROR: 'Internal Server Error',
  },

  Project: {
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_NOT_CREATED: 'Project creation failed',
    PROJECT_KEY_EXISTS: 'Project key already exists',
    USER_NO_ORG: 'User does not belong to any organization',
    ONLY_ADMIN: 'Only organization admin can create project',
    SERVER_ERROR: 'Internal Server Error',
  },
};
