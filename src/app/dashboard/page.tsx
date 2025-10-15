'use client';

import { useState, useEffect, useMemo } from 'react';
import { Credential as CredentialType, CredentialStatus } from '@/types';
import toast from 'react-hot-toast';
import { AddCredentialModal } from '../components/dashbord/AddCredentialModel';
import { CredentialCard } from '../components/dashbord/CredentialCard';
import { DashboardControls } from '../components/dashbord/DashboardControls';
import { DashboardStats } from '../components/dashbord/DashboardStats';
import { SkeletonCard } from '../components/dashbord/SkeletonCard';
import { EmptyState } from '../components/dashbord/EmptyState';
import { ConfirmDeleteModal } from '../components/dashbord/ConfirmDeleteModal';

type ApiCredential = Omit<CredentialType, 'id'> & { _id: string };

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<CredentialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrouped, setIsGrouped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [credentialToDelete, setCredentialToDelete] = useState<CredentialType | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/credentials');
        const data: ApiCredential[] = await res.json();
        setCredentials(data.map(({ _id, ...rest }) => ({ ...rest, id: _id })));
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
        toast.error('Failed to load credentials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCredentials();
  }, []);

  useEffect(() => {
    const verifyingCredentials = credentials.filter(c => c.status === 'Verifying');
    if (verifyingCredentials.length > 0) {
      verifyingCredentials.forEach(cred => {
        setTimeout(async () => {
          const finalStatus: CredentialStatus = cred.issuer.toLowerCase().includes('coursera') || cred.issuer.toLowerCase().includes('nptel') ? 'Verified' : 'Pending';
          const res = await fetch('/api/credentials', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cred.id, status: finalStatus }),
          });
          if (res.ok) {
            const updatedCred: ApiCredential = await res.json();
            setCredentials(prev => prev.map(c => c.id === cred.id ? { ...c, status: updatedCred.status } : c));
            toast.success(`'${cred.title}' has been verified.`);
          }
        }, 7000);
      });
    }
  }, [credentials]);

  const handleAddCredential = async (formData: FormData) => {
    const res = await fetch('/api/credentials', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const savedCredential: ApiCredential = await res.json();
      setCredentials(prev => [{ ...savedCredential, id: savedCredential._id }, ...prev]);
      toast.success('Credential added successfully!');
    } else {
      toast.error('Failed to add credential.');
    }
  };

  const handleDeleteCredential = async (id: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
    toast.success('Credential deleted.');
    const res = await fetch('/api/credentials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      toast.error('Could not delete credential from server.');
    }
  };

  const confirmDelete = (id: string) => {
    handleDeleteCredential(id);
    setCredentialToDelete(null);
  };

  const displayedCredentials = useMemo(() => {
    const filteredBySearch = credentials.filter(cred => {
      const query = searchQuery.toLowerCase();
      return (
        cred.title.toLowerCase().includes(query) ||
        cred.issuer.toLowerCase().includes(query) ||
        cred.skills.some(skill => skill.toLowerCase().includes(query))
      );
    });
    if (!isGrouped) return filteredBySearch;
    const uniqueCredentials = new Map<string, CredentialType>();
    filteredBySearch.forEach(cred => {
      if (cred.group) {
        if (!uniqueCredentials.has(cred.group)) {
          uniqueCredentials.set(cred.group, { ...cred, title: `Equivalent: ${cred.title}` });
        }
      } else {
        uniqueCredentials.set(cred.id.toString(), cred);
      }
    });
    return Array.from(uniqueCredentials.values());
  }, [isGrouped, searchQuery, credentials]);
  
return (
  <main className="min-h-screen bg-[#f9f0eb] text-neutral-900 p-4 sm:p-6 md:p-8">
    {/* Modals */}
    {showModal && (
      <AddCredentialModal
        onClose={() => setShowModal(false)}
        onAddCredential={handleAddCredential}
      />
    )}

    <ConfirmDeleteModal
      credential={credentialToDelete}
      onClose={() => setCredentialToDelete(null)}
      onConfirm={confirmDelete}
    />

    <div className="max-w-7xl mx-auto">
      {/* Top summary / quick actions — matches Hero style */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700">
              My Credentials
            </span>
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-xl">
            Aggregated and verified micro-credentials from all your platforms — curated in one portfolio.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="relative cursor-pointer py-3 px-5 rounded-sm bg-neutral-900 text-[#f9f0eb] font-semibold
                       border-4 border-transparent transition-all duration-180 transform-gpu will-change-transform
                       hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            aria-label="Add credential"
          >
            <span className="absolute inset-0 rounded-xl pointer-events-none" />
            <span className="relative z-10">Add credential</span>
          </button>

          
        </div>
      </div>

      {/* Controls (search / grouping) — visually separated */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-transparent">
        <DashboardControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isGrouped={isGrouped}
          onGroupToggle={() => setIsGrouped(!isGrouped)}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-md animate-pulse min-h-[12rem]" />
          ))}
        </div>
      ) : credentials.length === 0 ? (
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-md text-center">
            <EmptyState onAddClick={() => setShowModal(true)} />
          </div>
        </div>
      ) : (
        <>
          {/* stats card area */}
          <div className="mt-8">
            <DashboardStats credentials={credentials} />
          </div>

          {/* grid of credential cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {displayedCredentials.map((credential) => (
              <div
                key={credential.id}
                className="bg-white rounded-2xl p-4 shadow-md border border-transparent hover:shadow-lg transition-shadow"
              >
                {/* keep using your existing CredentialCard but wrap for consistent card styling */}
                <CredentialCard
                  credential={credential}
                  onDelete={setCredentialToDelete}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </main>
)
};
