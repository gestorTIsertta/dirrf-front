import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    router.push(paths.declaracao);
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
  };
}

