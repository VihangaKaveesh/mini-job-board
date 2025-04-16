'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);

  useEffect(() => {
    const fetchJobs = async () => {
      let query = `/api/jobs?skip=${skip}&take=${take}`;

      if (location) {
        query += `&location=${encodeURIComponent(location)}`;
      }

      if (jobType) {
        query += `&jobType=${encodeURIComponent(jobType)}`;
      }

      const res = await fetch(query);
      const data = await res.json();
      setJobs(data);
    };

    fetchJobs();
  }, [location, jobType, skip, take]); // Re-fetch when filters change

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Job Listings</h1>

        {/* Filter Inputs */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            className="w-full p-2 border"
            placeholder="Search by Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="text"
            className="w-full p-2 border"
            placeholder="Search by Job Type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
        </div>

        {/* Job Listings */}
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
