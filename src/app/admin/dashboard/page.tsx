'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  postedBy: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    description: '',
  });
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  
  const fetchJobs = async () => {
    const res = await fetch('/api/jobs', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('Failed to fetch jobs:', res.status);
      return;
    }

    const text = await res.text();
    if (!text) {
      console.warn('Empty response body from jobs API');
      return;
    }

    const data = JSON.parse(text);
    setJobs(data);
  };

  useEffect(() => {
    if (!token) return router.push('/auth/login');
    fetchJobs();
  }, []);

  const handleCreateJob = async () => {
    const { title, company, location, jobType, description } = form;

    if (!title || !company || !location || !jobType || !description) {
      alert('Please fill in all the fields before posting the job.');
      return;
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Job created successfully');
      setForm({ title: '', company: '', location: '', jobType: '', description: '' });
      fetchJobs(); // refresh job list
    } else {
      alert(data.error || 'Failed to create job');
    }
  };

  const deleteJob = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    const res = await fetch('/api/jobs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert('Job deleted successfully');
      setJobs(prev => prev.filter(job => job.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Jobs</h1>

        {/* Job Posting Form */}
        <div className="mb-6 space-y-2">
          <input
            className="w-full p-2 border"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full p-2 border"
            placeholder="Company"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
          />
          <input
            className="w-full p-2 border"
            placeholder="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="w-full p-2 border"
            placeholder="Job Type"
            value={form.jobType}
            onChange={e => setForm({ ...form, jobType: e.target.value })}
          />
          <textarea
            className="w-full p-2 border"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          ></textarea>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleCreateJob}
          >
            Post Job
          </button>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {jobs.map((job: Job) => (
            <div key={job.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>
                {job.company} — {job.location}
              </p>
              <p>{job.jobType}</p>
              <p>{job.description}</p>
              <button
                className="mt-2 text-red-500 underline"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
