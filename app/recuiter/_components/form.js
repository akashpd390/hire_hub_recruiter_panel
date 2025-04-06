'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export const Form = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // This will be assigned after the first render
  const [callbackUrl, setCallbackUrl] = useState('/recuiter/dashboard');

  useEffect(() => {
    const url = searchParams.get('callbackUrl');
    if (url) {
      setCallbackUrl(url);
    }
  }, [searchParams]);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('') // Reset error message
    const supabase_client = createClient();
    try {
      const { data, error: authError } = await supabase_client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }
      console.log("User signed in:", data.user);
      
      // Redirect after successful login
      router.push(callbackUrl);
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      
      {error && <Alert>{error}</Alert>}

      <Button className="w-full" size="lg">
        Login
      </Button>
    </form>
  )
}
