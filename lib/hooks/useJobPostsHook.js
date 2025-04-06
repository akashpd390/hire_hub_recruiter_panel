import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'


export const useJobPostsByUser = () => {
  const [jobPosts, setJobPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobPosts = async () => {
    const supabase_client = createClient();
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase_client.auth.getUser()

      if (userError || !userData?.user?.id) {
        console.error('No user found or failed to fetch user.')
        return
      }

      const userId = userData.user.id

      const { data, error } = await supabase_client
        .from('JobList')
        .select('*')
        .eq('created_by', userId)
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching job posts:', error)
      } else {
        setJobPosts(data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobPosts()
  }, [])

  return { jobPosts, loading }
}
