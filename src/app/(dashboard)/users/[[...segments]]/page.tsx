'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardActions, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '@/context/authContext';
import Forbidden from '@/components/forbidden';
import UsersGrid from './components/usersGrid';
import UserDetail from './components/userDetail';

export default function UsersPage() {
  const params = useParams();
  const [userId, action] = params.segments ?? [];
  const router = useRouter();
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Forbidden />;
  }

  return (
    <div className="flex justify-center">
      {userId && action === 'edit' ? (
        <UserDetail userId={Number(userId)} />
      ) : userId === 'new' ? (
        <UserDetail
          onInsert={(newUserId) => {
            router.push(`/users/${newUserId}/edit`);
          }}
        />
      ) : !userId ? (
        <Card>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.push('/users/new')}
            >
              Add User
            </Button>
          </CardActions>
          <CardContent>
            <UsersGrid />
          </CardContent>
        </Card>
      ) : (
        <Forbidden message="Page not found." />
      )}
    </div>
  );
}
