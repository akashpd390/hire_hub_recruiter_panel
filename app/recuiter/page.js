

import Link from 'next/link';
import {Form as LoginForm} from "./_components/form";
import {Header} from "./_components/headers";

export default function LoginPage() {
  return (
    <div className='h-screen w-screen bg-slate-100 flex flex-col justify-center items-center'>
       <Header/>
    <div className="flex justify-center items-center mt-20">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-2xl">Login</h1>
        <LoginForm />
        <p className="text-center">
          Need to create an account?{' '}
          <Link className="text-indigo-500 hover:underline" href="/recuiter/register">
            Create Account
          </Link>{' '}
        </p>
      </div>
    </div>
    </div>
  )
}