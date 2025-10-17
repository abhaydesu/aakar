'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Credential as CredentialType, CredentialStatus } from '@/types';
import toast from 'react-hot-toast';
import { AddCredentialModal } from '../components/dashboard/AddCredentialModel';
import { CredentialCard } from '../components/dashboard/CredentialCard';
import { DashboardControls } from '../components/dashboard/DashboardControls';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { EmptyState } from '../components/dashboard/EmptyState';
import { ConfirmDeleteModal } from '../components/dashboard/ConfirmDeleteModal';

type ApiCredential = Omit<CredentialType, 'id'> & { _id: string };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [credentials, setCredentials] = useState<CredentialType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrouped, setIsGrouped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [credentialToDelete, setCredentialToDelete] = useState<CredentialType | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }
    if (status === 'authenticated') {
      const role = session?.user?.role;
      if (!role) {
        router.push('/select-role');
        return;
      }
      if (role !== 'user') {
        router.push('/recruiter-dashboard');
        return;
      }
      const fetchCredentials = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('/api/credentials', { credentials: 'include' });
          const data: ApiCredential[] = await res.json();
          setCredentials(data.map(({ _id, ...rest }) => ({ ...rest, id: _id })));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch credentials:', error);
          toast.error('Failed to load credentials.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCredentials();
    }
  }, [status, session, router]);

  useEffect(() => {
    const verifyingCredentials = credentials.filter(c => c.status === 'Verifying');
    if (verifyingCredentials.length > 0) {
      verifyingCredentials.forEach(cred => {
        setTimeout(async () => {
          const isVerifiable = cred.issuer.toLowerCase().includes('coursera') || cred.issuer.toLowerCase().includes('nptel');
          const finalStatus: CredentialStatus = isVerifiable ? 'Verified' : 'VerificationFailed';

          const res = await fetch('/api/credentials', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: cred.id, status: finalStatus }),
          });
          if (res.ok) {
            const updatedCred: ApiCredential = await res.json();
            setCredentials(prev => prev.map(c => c.id === cred.id ? { ...c, status: updatedCred.status } : c));
            toast.success(`Verification for '${cred.title}' complete.`);
          }
        }, 7000);
      });
    }
  }, [credentials]);

  const handleAddCredential = async (formData: FormData) => {
    const res = await fetch('/api/credentials', {
      method: 'POST',
      body: formData,
      credentials: 'include',
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
    const originalCredentials = credentials;
    setCredentials(prev => prev.filter(cred => cred.id !== id));
    toast.success('Credential deleted.');

    const res = await fetch('/api/credentials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      toast.error('Could not delete from server.');
      setCredentials(originalCredentials);
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
          uniqueCredentials.set(cred.group, { ...cred, title: `Group: ${cred.title} & others` });
        }
      } else {
        uniqueCredentials.set(cred.id.toString(), cred);
      }
    });
    return Array.from(uniqueCredentials.values());
  }, [isGrouped, searchQuery, credentials]);

  if (status === 'loading' || !session) {
    return (
      <main className="min-h-screen bg-[#f9f0eb] flex items-center justify-center">
        <div className="text-xl font-semibold text-neutral-700">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f0eb] text-neutral-900 p-4 sm:p-6 md:p-8">
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
        <DashboardControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isGrouped={isGrouped}
          onGroupToggle={() => setIsGrouped(!isGrouped)}
          onAddClick={() => setShowModal(true)}
        />

        {(isLoading && credentials.length === 0) ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-md animate-pulse min-h-[12rem]" />
            ))}
          </div>
        ) : !isLoading && credentials.length === 0 ? (
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-md text-center">
              <EmptyState onAddClick={() => setShowModal(true)} />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8">
              <DashboardStats credentials={credentials} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {displayedCredentials.map((credential) => (
                  <CredentialCard
                    key={credential.id}
                    credential={credential}
                    onDelete={setCredentialToDelete}
                  />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};
