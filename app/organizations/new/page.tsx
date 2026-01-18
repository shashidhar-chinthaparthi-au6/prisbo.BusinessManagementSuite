'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, User, Mail, Phone, CreditCard } from 'lucide-react';

export default function NewOrganizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: '',
    plan: 'free' as 'free' | 'starter' | 'professional' | 'enterprise',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create organization');
      }

      // Auto-login the new owner
      const loginRes = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.ownerEmail,
          password: formData.ownerPassword,
        }),
      });

      if (loginRes.ok) {
        router.push('/dashboard?success=' + encodeURIComponent('Organization created successfully!'));
      } else {
        router.push('/login?email=' + encodeURIComponent(formData.ownerEmail));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { value: 'free', label: 'Free', price: '$0', users: '5 users', projects: '10 projects' },
    { value: 'starter', label: 'Starter', price: '$29/mo', users: '10 users', projects: '50 projects' },
    { value: 'professional', label: 'Professional', price: '$99/mo', users: '50 users', projects: '200 projects' },
    { value: 'enterprise', label: 'Enterprise', price: 'Custom', users: 'Unlimited', projects: 'Unlimited' },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="border-b border-neutral-light bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-dark">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-primary">Prisbo</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">Create Your Organization</h1>
            <p className="text-neutral">
              Set up your workspace and start managing your business
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-secondary/10 border border-secondary text-secondary px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Details */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-2">
                    Organization Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Organization Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-neutral-dark mb-2">
                    Custom Domain (optional)
                  </label>
                  <input
                    id="domain"
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="app.yourcompany.com"
                  />
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Select Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <label
                    key={plan.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.plan === plan.value
                        ? 'border-primary bg-primary/5'
                        : 'border-neutral-light hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.value}
                      checked={formData.plan === plan.value}
                      onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="font-semibold text-neutral-dark mb-1">{plan.label}</div>
                      <div className="text-lg font-bold text-primary mb-2">{plan.price}</div>
                      <div className="text-xs text-neutral">{plan.users}</div>
                      <div className="text-xs text-neutral">{plan.projects}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Owner Account */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Owner Account
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-neutral-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      id="ownerName"
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="ownerEmail" className="block text-sm font-medium text-neutral-dark mb-2">
                      Email *
                    </label>
                    <input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ownerPassword" className="block text-sm font-medium text-neutral-dark mb-2">
                    Password * (min 6 characters)
                  </label>
                  <input
                    id="ownerPassword"
                    type="password"
                    value={formData.ownerPassword}
                    onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
              <Link
                href="/login"
                className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
