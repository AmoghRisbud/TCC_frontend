import { getJobs } from "../../../lib/content";
import { notFound } from "next/navigation";
import Link from 'next/link';

// Force dynamic rendering to always fetch fresh data from Redis
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export default async function JobDetail({ params }: { params: { slug: string } }) {
  const jobs = await getJobs();
  const job = jobs.find(j => j.slug === params.slug);
  if (!job) return notFound();
  return (
    <div className="section container max-w-3xl">
      <h1 className="h1 mb-4">{job.title}</h1>
      
      {/* Job metadata badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.location && (
          <span className="badge">{job.location}</span>
        )}
        {job.type && (
          <span className="badge">{job.type}</span>
        )}
        {job.department && (
          <span className="badge">{job.department}</span>
        )}
      </div>

      <p className="mb-6">{job.description}</p>

      {/* Job details */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
        {job.salaryRange && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Salary Range:</span>
            <span className="text-gray-600">{job.salaryRange}</span>
          </div>
        )}
        {job.closingDate && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Closing Date:</span>
            <span className="text-gray-600">{new Date(job.closingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        )}
        {job.applyEmail && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Contact:</span>
            <a href={`mailto:${job.applyEmail}`} className="text-brand-primary hover:underline">{job.applyEmail}</a>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {job.requirements && (
          <div>
            <h2 className="h3 mb-2">Requirements</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        {job.responsibilities && (
          <div>
            <h2 className="h3 mb-2">Responsibilities</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-10">
        {job.applyUrl ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Apply Now
          </a>
        ) : (
          <Link
            href={`/careers?position=${encodeURIComponent(job.title)}#apply`}
            className="btn"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  );
}
