import { HttpStatus } from '@nestjs/common';

export type ErrorCodesStatusMapping = {
  [key: string]: HttpStatus;
};

export const PRISMA_ERROR_CODES: ErrorCodesStatusMapping = {
  P2000: HttpStatus.BAD_REQUEST, // The provided value for the column is too long for the column's type.
  P2001: HttpStatus.NOT_FOUND, // The record searched for in the where condition does not exist.
  P2002: HttpStatus.CONFLICT, // Unique constraint failed on the field.
  P2003: HttpStatus.BAD_REQUEST, // Foreign key constraint failed on the field.
  P2004: HttpStatus.BAD_REQUEST, // A constraint failed on the database.
  P2005: HttpStatus.BAD_REQUEST, // The value stored in the database for the field is invalid for the field's type.
  P2006: HttpStatus.BAD_REQUEST, // The provided value for the field is not valid.
  P2007: HttpStatus.BAD_REQUEST, // Data validation error.
  P2008: HttpStatus.INTERNAL_SERVER_ERROR, // Failed to parse the query.
  P2009: HttpStatus.INTERNAL_SERVER_ERROR, // Failed to validate the query.
  P2010: HttpStatus.INTERNAL_SERVER_ERROR, // Raw query failed. Code: {code}. Message: {message}
  P2011: HttpStatus.BAD_REQUEST, // Null constraint violation on the field.
  P2012: HttpStatus.BAD_REQUEST, // Missing a required value at {path}.
  P2013: HttpStatus.BAD_REQUEST, // Missing the required argument {argumentName} for field {fieldName} on {objectName}.
  P2014: HttpStatus.BAD_REQUEST, // The change you are trying to make would violate the required relation between the models.
  P2015: HttpStatus.NOT_FOUND, // A related record could not be found.
  P2016: HttpStatus.INTERNAL_SERVER_ERROR, // Query interpretation error.
  P2017: HttpStatus.INTERNAL_SERVER_ERROR, // The records for relation {relation} between the {parent} and {child} models are not connected.
  P2018: HttpStatus.NOT_FOUND, // The required connected records were not found.
  P2019: HttpStatus.INTERNAL_SERVER_ERROR, // Input error.
  P2020: HttpStatus.INTERNAL_SERVER_ERROR, // Value out of range for the type.
  P2021: HttpStatus.INTERNAL_SERVER_ERROR, // The table does not exist in the current database.
  P2022: HttpStatus.INTERNAL_SERVER_ERROR, // The column does not exist in the current database.
  P2023: HttpStatus.INTERNAL_SERVER_ERROR, // Inconsistent column data.
  P2024: HttpStatus.INTERNAL_SERVER_ERROR, // Timed out fetching a new connection from the connection pool.
  P2025: HttpStatus.NOT_FOUND, // An operation failed because it depends on one or more records that were required but not found.
  P2026: HttpStatus.INTERNAL_SERVER_ERROR, // The current database provider doesn't support a feature that the query used.
  P2027: HttpStatus.INTERNAL_SERVER_ERROR, // Multiple errors occurred on the database during query execution.
  P2030: HttpStatus.INTERNAL_SERVER_ERROR, // Cannot find a fulltext index to use for the search.
  P2031: HttpStatus.INTERNAL_SERVER_ERROR, // Prisma needs to perform a full restart.
  P2033: HttpStatus.INTERNAL_SERVER_ERROR, // A number used in the query does not fit into a 64-bit signed integer.
};
