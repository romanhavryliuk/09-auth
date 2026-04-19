'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: React.ReactNode;
};

const privatePrefixes = ['/profile', '/notes'];

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      const isPrivateRoute = privatePrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      );

      try {
        const hasSession = await checkSession();

        if (hasSession) {
          const user = await getMe();
          if (isMounted) setUser(user);
        } else {
          clearIsAuthenticated();

          if (isPrivateRoute) {
            router.replace('/sign-in');
            return;
          }
        }
      } catch {
        clearIsAuthenticated();

        if (isPrivateRoute) {
          router.replace('/sign-in');
          return;
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  const isPrivateRoute = privatePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isChecking && isPrivateRoute) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}