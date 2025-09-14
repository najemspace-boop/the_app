import React from 'react';
import { Container, Center } from '@mantine/core';
import { AuthenticationForm } from '../../components/auth/AuthenticationForm';

const MantineAuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container size={420} my={40}>
        <Center>
          <AuthenticationForm style={{ width: '100%', maxWidth: 420 }} />
        </Center>
      </Container>
    </div>
  );
};

export default MantineAuthPage;