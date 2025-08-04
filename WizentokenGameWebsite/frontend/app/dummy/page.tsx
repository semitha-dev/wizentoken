// pages/index.tsx
"use client"
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        setProfiles(data || [])
      }
    }
    fetchProfiles()
  }, [])

  return (
    <div>
      <h1>Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.username}</li>
        ))}
      </ul>
    </div>
  )
}
