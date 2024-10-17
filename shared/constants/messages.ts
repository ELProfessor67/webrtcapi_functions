// Define messages object with predefined validation and error messages
const commonMessages = {
  /* Error messages */
  ValidationError: "Validierungsfehler", // There is a validation error with the provided data.
  DataNotFound: "Daten nicht gefunden", // The requested data is not found.
  InternalServerError: "Interner Serverfehler", // An internal server error occurred.
  FileUploadErr: "Fehler beim Hochladen der Datei", // Error while uploading the file.
  FileNotProvided: "Datei nicht bereitgestellt", // File not provided error.
  FileSavedErr: "Fehler beim Speichern der Datei", // Error while saving the file.
  FileDeleted: "Datei erfolgreich gelöscht", // File successfully deleted.
  FileDeleteError: "Fehler beim Löschen der Datei", // Error while deleting the file.
  RequiredField: "Dieses Feld ist ein Pflichtfeld", // Message for required fields
  SomethingWrong: "Etwas ist schief gelaufen.", // A generic message indicating that something went wrong.

  /* Success Messages */
  DataRetrivedSuccess: "Daten erfolgreich abgerufen", // Data retrieval is successful.
  Success: "Erfolg", // Generic success message.
  FileSavedSuccess: "Datei erfolgreich gespeichert", // File successfully saved.
};

const authMessages = {
  /* Error messages */
  EmailValidation: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", // Message for invalid email address
  EmailAlreadyExist: "E-Mail ist bereits vorhanden", // The provided email is already registered in the system.
  PasswordStrong: "Das Passwort sollte sicher sein", // Message for password strength requirement
  TotpGenerateFailed: "TOTP konnte nicht generiert werden", // TOTP (Time-based One-Time Password) generation failed.
  InvalidEmailPass: "Ungültige E-Mail oder Passwort", // The provided email or password is invalid.
  LinkExpired: "Link abgelaufen", // The provided link has expired.
  UserNotExist: "Benutzer existiert nicht", // The specified user does not exist.
  LinkNotValid: "Der Link ist ungültig", // The provided link is not valid.
  InvalidOTP: "Ungültiges OTP", // The provided OTP (One-Time Password) is invalid.
  InvalidOldPass: "Ungültige Passwort", // Invalid old password.
  AuthenticatorAppCodeMinLength: "Der Code muss mindestens 6 Stellen lang sein", // OTP code must be at least 6 characters long.
  AuthenticatorAppCodeMaxLength: "Der Code darf nicht länger als 6 Stellen sein", // OTP code cannot exceed 6 characters in length.
  AuthenticatorAppCodeFixLength: "Der Code muss eine 6-stellige Zahl sein", // OTP code must be exactly 6 digits long.

  /* Success Messages */
  RegisterSuccess: "Registrierung erfolgreich", // User registration is successful.
  LoginSuccess: "Anmeldung erfolgreich", // User login is successful.
  PasswordResetSuccess: "Überprüfen Sie Ihre E-Mails auf ein neues Passwort", // The password reset is successful, and the user should check their email for the new password.
  PasswordUpdateSuccess: "Passwort erfolgreich aktualisiert.", // The password update is successful.
  TwoFaEnabled: "Die Zwei-Faktor-Authentifizierung ist aktiviert", // Two-factor authentication (2FA) is enabled successfully.
  TwoFaUpdated: "Die Zwei-Faktor-Authentifizierung wurde aktualisiert", // Two-factor authentication (2FA) is updated successfully.
  TwoFaDisabled: "Die Zwei-Faktor-Authentifizierung ist deaktiviert", // Two-factor authentication (2FA) is disabled successfully.
  VerificationSuccess: "OTP-Überprüfung erfolgreich", // OTP (One-Time Password) verification is successful.
  SavedSuccess: "Erfolgreich gespeichert", // Generic success message.
};

const contactMessages = {
  /* Success Messages */
  EmailSentSuccess: "E-Mail erfolgreich gesendet",
};

const cookieMessages = {
  NecessaryCookieSetSuccess: "Notwendige Cookies erfolgreich gesetzt", // Necessary cookies set successfully.
  CookieSetSuccess: "Cookie erfolgreich gesetzt", // Cookie set successfully.
  CookieDeleteSuccess: "Cookie erfolgreich gelöscht", // Cookie deleted successfully.
  AllCookiesDeleteSuccess: "Alle Cookies gelöscht", // All cookies deleted successfully.
  NoCookiesToDelete: "Keine Cookies zum Löschen", // No cookies to delete.
};

const bankMessages = {
  /* Error messages */
  UserBankAlreadyExists: "Bank mit demselben Benutzer existiert bereits", // Bank with same user already exists
  /* Success Messages */
  BankCreatedSuccess: "Bank erfolgreich erstellt", // Bank Created Successfully
};

// Export themeMessages object by spreading messages
const otherMessages = {
  PdfDocAllowed: "Bitte laden Sie eine PDF, DOC, DOCX Datei mit einer Größe von weniger als 2 MB hoch.",
};
// Export themeMessages object by spreading messages
export const themeMessages = {
  ...commonMessages,
  ...authMessages,
  ...contactMessages,
  ...otherMessages,
  ...cookieMessages,
  ...bankMessages,
};
