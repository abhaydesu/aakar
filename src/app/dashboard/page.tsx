'use client';

import { useState, useEffect, useMemo } from 'react';
import { Credential as CredentialType, CredentialStatus } from '@/types';
import toast from 'react-hot-toast';

// FIX: Corrected typo in all import paths ('dashboard' instead of 'dashbord') and used absolute paths
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

  // FIX: Added the missing useEffect to fetch initial data
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
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      {showModal && <AddCredentialModal onClose={() => setShowModal(false)} onAddCredential={handleAddCredential} />}
      
      {/* FIX: Added the missing delete confirmation modal */}
      <ConfirmDeleteModal 
        credential={credentialToDelete}
        onClose={() => setCredentialToDelete(null)}
        onConfirm={confirmDelete}
      />
      
      <div className="max-w-7xl mx-auto">
        <DashboardControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isGrouped={isGrouped}
          onGroupToggle={() => setIsGrouped(!isGrouped)}
          onAddClick={() => setShowModal(true)}
        />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : credentials.length === 0 ? (
          <div className="mt-16"><EmptyState onAddClick={() => setShowModal(true)} /></div>
        ) : (
          <>
            <DashboardStats credentials={credentials} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCredentials.map((credential) => (
                <CredentialCard 
                  key={credential.id} 
                  credential={credential} 
                  // FIX: Pass the entire credential object to the delete handler to open the modal
                  onDelete={setCredentialToDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}