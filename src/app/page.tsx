'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <><Navbar></Navbar>
    <div className="p-6">
        
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      <div className="space-y-4">
        {jobs.map((job: any) => (
          <div key={job.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company} — {job.location}</p>
            <p className="italic">{job.jobType}</p>
            <p>{job.description}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
