export const MESSAGES = {
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  FAILED_CREATE_USER: 'Failed to create user',
  INVALID_JSON: 'Invalid JSON',
  NO_PERMISSION: 'You do not have permission to perform this action',
  UNAUTHORIZED: 'Unauthorized access',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  OK: 200,
  CREATED: 201,
};

export const NOT_FOUND_ERRORS = {
  MEMBER_NOT_FOUND: 'Member not found',
  CARD_NOT_FOUND: 'Card not found',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
};

export const CARD_ERRORS = {
  ADD_CARD_FAILED: 'Failed to add card',
  UPDATE_CARD_FAILED: 'Failed to update card details',
  GET_CARD_FAILED: 'Failed to fetch card details',
};

export const TRANSACTION_ERRORS = {
  INVALID_AMOUNT: 'Please enter a valid amount',
  INSUFFICIENT_BALANCE: 'Balance not enough',
  FAILED_TRANSACTION: 'Transaction failed',
  ALL_CARDS_BLOCKED: 'Unlock your card to transfer',
  RECIPIENT_NO_ACTIVE_CARD: 'Recipient has no active card to receive funds',
  RECIPIENT_NOT_FOUND: 'Recipient not found',
};
