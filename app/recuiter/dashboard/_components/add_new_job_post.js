'use client'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export const AddNewJobPost = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    salaryRange: '',
    workingModel: '',
    category: '',
    level: '',
    jobType: '',
    experience: '',
    jobDescription: '',
  })
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [userId, setUserId] = useState(null)

  const supabase_client = createClient();
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData } = await supabase_client.auth.getUser()
      if (userData?.user) {
        setUserId(userData.user.id)
        const { data: profileData } = await supabase_client
          .from('recuiter')
          .select('organisation')
          .eq('id', userData.user.id)
          .single()
        if (profileData) setCompanyName(profileData.company_name)
      }
    }
    fetchUserData()
  }, [])

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value })

  const onSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)

    const {
      jobTitle,
      salaryRange,
      workingModel,
      category,
      level,
      jobType,
      experience,
      jobDescription,
    } = formData

    if (
      !jobTitle ||
      !salaryRange ||
      !workingModel ||
      !category ||
      !level ||
      !jobType ||
      !experience ||
      !jobDescription
    ) {
      alert('Please fill in all fields.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase_client.from('JobList').insert([
        {
          job_title: jobTitle.trim(),
          type: jobType.trim(),
          experience: experience.trim(),
          created_by: userId,
          company_name: companyName.trim(),
          salary: salaryRange.trim(),
          working_model: workingModel.trim(),
          tags: category.trim(),
          level: level.trim(),
          job_desc: jobDescription.trim(),
          location: "Mumbai",
        },
      ])

      if (error) {
        console.error('Error inserting data into JobList:', error)
        setLoading(false)
        return
      }

      setIsActive(false)
    } catch (error) {
      console.error('Error submitting job post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setIsActive(true)}
      >
        <h2 className='font-bold text-lg text-center'>+ Create new Post</h2>
      </div>

      <Dialog open={isActive} onOpenChange={setIsActive}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>
              Tell us more about the job post
            </DialogTitle>
            <DialogDescription>
              Fill in the job details below. All fields are required.
            </DialogDescription>
          </DialogHeader>

          {/* Moved outside DialogDescription to avoid nesting inside <p> */}
          <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='col-span-1'>
              <Field label='Job Title' value={formData.jobTitle} onChange={handleChange('jobTitle')} />
              <Field label='Salary Range' value={formData.salaryRange} onChange={handleChange('salaryRange')} />
              <Field label='Working Model' value={formData.workingModel} onChange={handleChange('workingModel')} />
              <Field label='Category' value={formData.category} onChange={handleChange('category')} />
              <Field label='Level' value={formData.level} onChange={handleChange('level')} />
            </div>

            <div className='col-span-1'>
              <TextAreaField label='Job Type' value={formData.jobType} onChange={handleChange('jobType')} height='h-32' />
              <Field label='Years of Experience' type='number' max={50} value={formData.experience} onChange={handleChange('experience')} />
              <TextAreaField label='Job Description' value={formData.jobDescription} onChange={handleChange('jobDescription')} height='h-48' />
            </div>

            <div className='flex gap-5 justify-between col-span-2'>
              <Button type='button' variant='ghost' className='bg-secondary hover:bg-red-600' onClick={() => setIsActive(false)}>
                Cancel
              </Button>
              <Button type='submit' className='hover:bg-green-800' disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className='animate-spin mr-2' /> Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper components
const Field = ({ label, type = 'text', value, onChange, max }) => (
  <div className='mt-7 my-3 text-gray-700'>
    <label>{label}</label>
    <Input type={type} value={value} onChange={onChange} placeholder={`Ex: ${label}`} max={max} required />
  </div>
)

const TextAreaField = ({ label, value, onChange, height }) => (
  <div className='mt-7 my-3 text-gray-700'>
    <label>{label}</label>
    <Textarea value={value} onChange={onChange} placeholder={`Ex: ${label}`} required className={height} />
  </div>
)
