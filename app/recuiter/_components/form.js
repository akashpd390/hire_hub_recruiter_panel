'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from "@/utils/supabase/client";
import { useRouter,} from 'next/navigation'
import { useState, } from 'react'

export const Form = () => {
  const router = useRouter()
  // const searchParams = useSearchParams()

  // This will be assigned after the first render
  const [callbackUrl, setCallbackUrl] = useState('/recuiter/dashboard');

  // useEffect(() => {
  //   const url = searchParams.get('callbackUrl');
  //   if (url) {
  //     setCallbackUrl(url);
  //   }
  // }, [searchParams]);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('') // Reset error message
    setLoading(true)
    const supabase_client = createClient();
    try {
      const { data, error: authError } = await supabase_client.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      console.log("User signed in:", data.user);
      
      // Redirect after successful login
      router.push(callbackUrl);
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setLoading(false);
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

      <Button className="w-full relative" size="lg" disabled={loading}>
        {loading ? (
             <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
             </div>
        ) : (
            "Login"
        )}
      </Button>
    </form>
  )
}
