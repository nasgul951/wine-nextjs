'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  TextField,
  IconButton,
  CardActions,
  FormControlLabel,
  Switch,
  Button
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useUserService } from '@/hooks/service';
import { useAuth } from '@/context/authContext';
import { User, UpdateUserRequest } from '@/types/user';
import AlertBox from '@/components/alertBox';
import ConfirmDialog from '@/components/confirmDialog';
import PasswordInput, { getPasswordErrors } from '@/components/passwordInput';

const emailSchema = z.string().email('Please enter a valid email address');

interface IUserDetailProps {
  username: string;
  isAdmin: boolean;
}

interface IUserFormState extends IUserDetailProps {
  password: string;
  confirmPassword: string;
}

const toUserDetailProps = (user: User | null): IUserDetailProps => ({
  username: user?.username ?? '',
  isAdmin: user?.isAdmin ?? false
});

const UserDetail = ({
  userId,
  onInsert
}: {
  userId?: number | null;
  onInsert?: (userId: number) => void;
}) => {
  const userService = useUserService();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [data, setData] = React.useState<IUserFormState>({
    ...toUserDetailProps(null),
    password: '',
    confirmPassword: ''
  });
  const [emailError, setEmailError] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const initialValueRef = React.useRef<string>(JSON.stringify(toUserDetailProps(null)));
  const isCreate = !userId;
  const isSelf = userId === currentUser?.userId;

  const isDirty = React.useMemo(() => {
    const currentData: IUserDetailProps = {
      username: data.username,
      isAdmin: data.isAdmin
    };
    const hasPasswordChange = data.password.length > 0;
    return initialValueRef.current !== JSON.stringify(currentData) || hasPasswordChange;
  }, [data]);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(Number(userId));
        if (!response.success) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        const userData = toUserDetailProps(response.data!);
        setData({
          ...userData,
          password: '',
          confirmPassword: ''
        });
        initialValueRef.current = JSON.stringify(userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId, userService]);

  const validateEmail = (email: string): boolean => {
    try {
      emailSchema.parse(email);
      setEmailError('');
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setEmailError(err.errors[0].message);
      }
      return false;
    }
  };

  const validateForm = (): boolean => {
    const emailValid = validateEmail(data.username);

    // Password validation: required for create, optional for edit
    const passwordError = getPasswordErrors(
      data.password,
      data.confirmPassword,
      isCreate // required only on create
    );

    if (passwordError) {
      setError(passwordError);
      return false;
    }

    return emailValid;
  };

  const saveUser = async () => {
    if (!validateForm()) return;

    try {
      const request: UpdateUserRequest = {
        username: data.username,
        isAdmin: data.isAdmin
      };

      // Only include password if provided
      if (data.password) {
        request.password = data.password;
      }

      let response;
      if (userId) {
        response = await userService.patchUser(userId, request);
      } else {
        response = await userService.addUser(request);
        if (response.success && onInsert) {
          onInsert(response.data!.id);
          return;
        }
      }

      if (!response.success) {
        throw new Error(`Failed to save user: ${response.status}`);
      }

      const newData = toUserDetailProps(response.data!);
      setData({
        ...newData,
        password: '',
        confirmPassword: ''
      });
      initialValueRef.current = JSON.stringify(newData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save user');
    }
  };

  const handleDelete = async () => {
    if (!userId || isSelf) return;

    try {
      const response = await userService.deleteUser(userId);
      if (!response.success) {
        throw new Error(`Failed to delete user: ${response.status}`);
      }
      router.push('/users');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
    setDeleteDialogOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setData((prev) => ({ ...prev, username: value }));
    validateEmail(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <AlertBox type="error" message={error} onClear={() => setError(null)} />

      <Card className="w-xl">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {isCreate ? 'Create User' : 'Edit User'}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                name="username"
                label="Email"
                type="email"
                value={data.username}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                fullWidth
                required
              />
            </Grid>

            <Grid size={12}>
              <PasswordInput
                password={data.password}
                confirmPassword={data.confirmPassword}
                onPasswordChange={(password) => setData((prev) => ({ ...prev, password }))}
                onConfirmPasswordChange={(confirmPassword) =>
                  setData((prev) => ({ ...prev, confirmPassword }))
                }
                required={isCreate}
                passwordLabel={isCreate ? 'Password' : 'New Password (leave blank to keep current)'}
              />
            </Grid>

            <Grid size={12}>
              <FormControlLabel
                disabled={isSelf}
                control={
                  <Switch
                    checked={data.isAdmin}
                    onChange={(e) => setData((prev) => ({ ...prev, isAdmin: e.target.checked }))}
                  />
                }
                label="Administrator"
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <div>
            {userId && !isSelf && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            )}
          </div>
          <div>
            {isDirty && (
              <Alert
                severity="warning"
                variant="filled"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
                action={
                  <IconButton aria-label="save" color="inherit" onClick={saveUser}>
                    <SaveIcon />
                  </IconButton>
                }
              >
                <Typography variant="body2">Unsaved Changes</Typography>
              </Alert>
            )}
          </div>
        </CardActions>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete the user "${data.username}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default UserDetail;
