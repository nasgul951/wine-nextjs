'use client';
import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordInputProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  showConfirm?: boolean;
  required?: boolean;
  disabled?: boolean;
  passwordLabel?: string;
  confirmLabel?: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  matches: boolean;
}

const validatePassword = (password: string): Omit<PasswordValidation, 'matches'> => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
});

const isPasswordValid = (validation: Omit<PasswordValidation, 'matches'>): boolean =>
  validation.minLength &&
  validation.hasUppercase &&
  validation.hasLowercase &&
  validation.hasNumber &&
  validation.hasSpecial;

export const getPasswordErrors = (password: string, confirmPassword: string, required: boolean = true): string | null => {
  if (!password && !required) return null;
  if (!password && required) return 'Password is required';

  const validation = validatePassword(password);
  if (!isPasswordValid(validation)) {
    return 'Password does not meet complexity requirements';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

const PasswordInput = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  showConfirm = true,
  required = true,
  disabled = false,
  passwordLabel = 'Password',
  confirmLabel = 'Confirm Password'
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validation = validatePassword(password);
  const passwordIsValid = isPasswordValid(validation);
  const passwordsMatch = password === confirmPassword;

  const showValidation = password.length > 0;
  const showMatchError = showConfirm && confirmPassword.length > 0 && !passwordsMatch;

  return (
    <Box>
      <TextField
        fullWidth
        label={passwordLabel}
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required={required}
        disabled={disabled}
        error={showValidation && !passwordIsValid}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
      {showValidation && !passwordIsValid && (
        <Box sx={{ mt: 1 }}>
          <FormHelperText error={!validation.minLength}>
            {validation.minLength ? '✓' : '✗'} At least 8 characters
          </FormHelperText>
          <FormHelperText error={!validation.hasUppercase}>
            {validation.hasUppercase ? '✓' : '✗'} At least one uppercase letter
          </FormHelperText>
          <FormHelperText error={!validation.hasLowercase}>
            {validation.hasLowercase ? '✓' : '✗'} At least one lowercase letter
          </FormHelperText>
          <FormHelperText error={!validation.hasNumber}>
            {validation.hasNumber ? '✓' : '✗'} At least one number
          </FormHelperText>
          <FormHelperText error={!validation.hasSpecial}>
            {validation.hasSpecial ? '✓' : '✗'} At least one special character
          </FormHelperText>
        </Box>
      )}

      {showConfirm && (
        <TextField
          fullWidth
          label={confirmLabel}
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required={required && password.length > 0}
          disabled={disabled}
          error={showMatchError}
          helperText={showMatchError ? 'Passwords do not match' : ''}
          sx={{ mt: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
      )}
    </Box>
  );
};

export default PasswordInput;
