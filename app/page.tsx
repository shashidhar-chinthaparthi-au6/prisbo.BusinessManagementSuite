import Link from 'next/link';
import { ArrowRight, Users, FolderKanban, BarChart3, UserCog } from 'lucide-react';
import Script from 'next/script';

export default function HomePage() {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Prisbo – Business Management Suite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Prisbo Services',
    url: 'https://www.prisboservices.com',
    logo: 'https://www.prisboservices.com/logo.png',
  };

  return (
    <>
      <Script
        id="software-application-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-neutral-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-primary">Prisbo</h1>
                <p className="text-sm text-neutral">Business Management Suite</p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-primary hover:text-primary-dark font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-neutral-dark mb-6">
              Complete Business Management Suite
            </h1>
            <p className="text-xl text-neutral mb-8 max-w-2xl mx-auto">
              Manage your customers, projects, teams, and analytics all in one integrated platform.
              Built for scale, designed for efficiency.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/organizations/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg"
              >
                Create Organization
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-neutral-light py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-neutral-dark mb-12">
              Everything You Need to Manage Your Business
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">CRM Integration</h3>
                <p className="text-neutral">
                  Manage customers and leads with full contact details, status tracking, and activity history.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Project Tracking</h3>
                <p className="text-neutral">
                  Track projects from start to finish with task management, deadlines, and customer linking.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Analytics Dashboard</h3>
                <p className="text-neutral">
                  Get insights into your business with comprehensive analytics and visual reports.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <UserCog className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Team Collaboration</h3>
                <p className="text-neutral">
                  Manage your team with role-based permissions, task assignments, and activity logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-primary rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start managing your business more efficiently today.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-neutral-light transition-colors font-semibold text-lg"
            >
              Request Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-light bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-neutral">
              <p className="font-semibold mb-2">Business Management Suite</p>
              <p className="text-sm">
                <a href="https://www.prisboservices.com" className="hover:text-primary">
                  https://www.prisboservices.com
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
