'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {Header} from "./_components/header";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'

export default function RecruiterRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organisation: '',
    location: '',
    organisation_desc: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleRegister = async (e) => {
    const supabase_client = createClient();
    e.preventDefault()
    setLoading(true)

    const { email, password, name, organisation, location, organisation_desc } = form

    try {
      const { data: authData, error: signUpError } = await supabase_client.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      const userId = authData?.user?.id
      if (!userId) throw new Error('User ID not found')

      const { error: profileError } = await supabase_client.from('recuiters').insert([
        {
          id: userId,
          name,
          email,
          organisation,
          location,
          organisation_desc,
        },
      ])

      if (profileError) throw profileError

      router.push('/recuiter/dashboard')
    } catch (err) {
      console.error('Registration error:', err.message)
      alert('Registration failed. Please check your inputs or try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className='mt-20'>
      <Header/>
    <div className="max-w-xl mx-auto mt-10 p-8 border rounded-lg shadow">

      <h1 className="text-2xl font-bold mb-6">Recruiter Registration</h1>
      <form onSubmit={handleRegister} className="grid gap-4">
        <Input type="text" placeholder="Full Name" value={form.name} onChange={handleChange('name')} required />
        <Input type="email" placeholder="Email" value={form.email} onChange={handleChange('email')} required />
        <Input type="password" placeholder="Password" value={form.password} onChange={handleChange('password')} required />
        <Input type="text" placeholder="Organisation Name" value={form.organisation} onChange={handleChange('organisation')} required />
        <Input type="text" placeholder="Location" value={form.location} onChange={handleChange('location')} required />
        <Textarea placeholder="Short Description about Organisation" value={form.organisation_desc} onChange={handleChange('organisation_desc')} required />

        <Button type="submit" disabled={loading} className="w-full relative py-6">
          {loading ? (
             <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
             </div>
          ) : (
            'Register'
          )}
        </Button>
      </form>
      <p className="text-center mt-10">
          Already have an account?{' '}
          <Link className="text-indigo-500 hover:underline" href="/recuiter">
            Login
          </Link>{' '}
        </p>
    </div>
    </div>
  )
}
