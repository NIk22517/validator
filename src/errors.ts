export enum ValidationStringError {
  NOT_A_STRING = "Value must be a string",
  TOO_SHORT = "String is too short",
  TOO_LONG = "String is too long",
  INVALID_LENGTH = "String is not equal",
  START_ERROR = "String must start with specified value",
  END_ERROR = "String must end with specified value",
  REGEX_ERROR = "String does not match regex",
  INVALID_EMAIL = "Invalid email",
  INVALID_URL = "Invalid URL",
  INCLUDES_ERROR = "String must include specified value",
  EXCLUDES_ERROR = "String must exclude specified value",
}
