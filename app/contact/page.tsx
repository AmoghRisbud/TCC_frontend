"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const contactMethods = [
  {
    title: "Email Us",
    description: "For general inquiries and support",
    value: "info.thecollectivecounsel@gmail.com",
    href: "mailto:info.thecollectivecounsel@gmail.com",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Join Community",
    description: "Connect with us on WhatsApp",
    value: "Join WhatsApp Group",
    href: "#",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    title: "Follow Us",
    description: "Stay updated on LinkedIn",
    value: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);
  const searchParams = useSearchParams();
  
  // Student form state
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [studentStatus, setStudentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Organization form state
  const [orgFormData, setOrgFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    partnershipDetails: '',
  });
  const [orgSubmitting, setOrgSubmitting] = useState(false);
  const [orgStatus, setOrgStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
  const type = searchParams.get("type");

  if (type === "partner") {
    setShowOrgForm(true);
    setShowStudentForm(false);
  }

  if (type === "student") {
    setShowStudentForm(true);
    setShowOrgForm(false);
  }
}, [searchParams]);

  // Handle student form submission
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentSubmitting(true);
    setStudentStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStudentStatus({
        type: 'success',
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      });
      
      // Reset form
      setStudentFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      setStudentStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      });
    } finally {
      setStudentSubmitting(false);
    }
  };

  // Handle organization form submission
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgSubmitting(true);
    setOrgStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact/organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit partnership request');
      }

      setOrgStatus({
        type: 'success',
        message: 'Your partnership request has been submitted successfully! We\'ll review it and get back to you soon.',
      });
      
      // Reset form
      setOrgFormData({ organizationName: '', contactPerson: '', email: '', partnershipDetails: '' });
      
    } catch (error) {
      setOrgStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit request. Please try again.',
      });
    } finally {
      setOrgSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Get in Touch</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Have questions or want to learn more about TCC? We&apos;d love to
              hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="card-interactive group text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-brand-dark mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-brand-muted mb-3">
                    {method.description}
                  </p>
                  <span className="text-brand-primary font-medium text-sm">
                    {method.value}
                  </span>
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="h3 mb-6 text-brand-dark">
                How would you like to connect?
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowStudentForm(true);
                    setShowOrgForm(false);
                  }}
                  className="btn-secondary"
                >
                  🎓 Are you a Student and want to learn?
                </button>

                <button
    onClick={() => {
      setShowOrgForm(true);
      setShowStudentForm(false);
    }}
    className="btn-secondary"
  >
    🏢 Are you an Organization and want to partner with us?
  </button>
              </div>
            </div>

            {/* Student Contact Form */}
            {showStudentForm && (
              <div className="card max-w-2xl mx-auto animate-fade-in">
                <h2 className="h3 mb-6 text-center text-brand-dark">
                  Send Us a Message
                </h2>

                {studentStatus.type && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      studentStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {studentStatus.message}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleStudentSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-2">
                        Name *
                      </label>
                      <input 
                        className="input" 
                        placeholder="Your name"
                        value={studentFormData.name}
                        onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-dark mb-2">
                        Email *
                      </label>
                      <input 
                        type="email"
                        className="input" 
                        placeholder="your@email.com"
                        value={studentFormData.email}
                        onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Subject *
                    </label>
                    <input
                      className="input"
                      placeholder="What is this regarding?"
                      value={studentFormData.subject}
                      onChange={(e) => setStudentFormData({ ...studentFormData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      className="input resize-none"
                      rows={5}
                      placeholder="Your message..."
                      value={studentFormData.message}
                      onChange={(e) => setStudentFormData({ ...studentFormData, message: e.target.value })}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="btn"
                      disabled={studentSubmitting}
                    >
                      {studentSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showOrgForm && (
  <div className="card max-w-2xl mx-auto animate-fade-in">
    <h2 className="h3 mb-6 text-center text-brand-dark">
      Partner With Us
    </h2>

    {orgStatus.type && (
      <div
        className={`mb-6 p-4 rounded-lg ${
          orgStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        {orgStatus.message}
      </div>
    )}

    <form className="space-y-6" onSubmit={handleOrgSubmit}>
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-2">
          Organization Name *
        </label>
        <input 
          className="input" 
          placeholder="Your organization name"
          value={orgFormData.organizationName}
          onChange={(e) => setOrgFormData({ ...orgFormData, organizationName: e.target.value })}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Contact Person *
          </label>
          <input 
            className="input" 
            placeholder="Full name"
            value={orgFormData.contactPerson}
            onChange={(e) => setOrgFormData({ ...orgFormData, contactPerson: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-2">
            Email *
          </label>
          <input 
            type="email"
            className="input" 
            placeholder="contact@email.com"
            value={orgFormData.email}
            onChange={(e) => setOrgFormData({ ...orgFormData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-dark mb-2">
          Partnership Details *
        </label>
        <textarea
          className="input resize-none"
          rows={5}
          placeholder="Tell us how you'd like to collaborate..."
          value={orgFormData.partnershipDetails}
          onChange={(e) => setOrgFormData({ ...orgFormData, partnershipDetails: e.target.value })}
          required
        />
      </div>

      <div className="text-center">
        <button 
          type="submit" 
          className="btn"
          disabled={orgSubmitting}
        >
          {orgSubmitting ? 'Submitting...' : 'Submit Partnership Request'}
        </button>
      </div>
    </form>
  </div>
)}

          </div>
        </div>
      </section>
    </div>
  );
}
