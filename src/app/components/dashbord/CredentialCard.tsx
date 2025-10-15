import { FiCheckCircle, FiClock, FiUser, FiTrash2, FiExternalLink, FiLoader, FiShield, FiXCircle } from "react-icons/fi";
import { Credential, CredentialStatus } from "@/types";
import { useState, useEffect } from "react";

const StatusBadge = ({ status }: { status: CredentialStatus }) => {
  // FIX: Added 'Verifying' and 'VerificationFailed' to the style and icon maps
  const styles = {
    Verified: 'bg-green-900/50 text-green-400',
    Pending: 'bg-yellow-900/50 text-yellow-400',
    'Self-Reported': 'bg-gray-700 text-gray-400',
    Verifying: 'bg-blue-900/50 text-blue-300',
    VerificationFailed: 'bg-red-900/50 text-red-400',
  };
  const icons = {
    Verified: <FiCheckCircle className="mr-1.5" />,
    Pending: <FiClock className="mr-1.5" />,
    'Self-Reported': <FiUser className="mr-1.5" />,
    Verifying: <FiLoader className="mr-1.5 animate-spin" />,
    VerificationFailed: <FiXCircle className="mr-1.5" />,
  };
  return (
    <span className={`flex items-center text-xs px-2 py-1 rounded-full ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

const VerificationSimulator = ({ credential }: { credential: Credential }) => {
  const steps = ["Validating Digital Signature", "Cross-referencing with Issuer", "Checking for Revocation"];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2 mt-2">
      {steps.map((step, index) => (
        <div key={step} className={`flex items-center text-xs transition-colors duration-500 ${currentStep > index ? 'text-green-400' : 'text-gray-400'}`}>
          {currentStep > index ? <FiCheckCircle className="mr-2 flex-shrink-0" /> : currentStep === index ? <FiLoader className="mr-2 flex-shrink-0 animate-spin" /> : <FiClock className="mr-2 flex-shrink-0" />}
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export const CredentialCard = ({ credential, onDelete }: { credential: Credential, onDelete: (credential: Credential) => void; }) => {
  if (credential.status === 'Verifying') {
    return (
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col justify-between shadow-lg border border-blue-500/50">
        <div>
          <h3 className="font-bold text-lg text-white">{credential.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{credential.issuer}</p>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-3">
          <div className="flex items-center text-sm text-blue-300 mb-2">
            <FiShield className="mr-2" />
            <span>Verification in Progress...</span>
          </div>
          <VerificationSimulator credential={credential} />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gray-800 rounded-lg p-4 flex flex-col justify-between transform hover:scale-105 transition-transform duration-300 shadow-lg">
      <button 
        onClick={() => onDelete(credential)}
        className="absolute top-2 right-2 p-1.5 bg-red-800/50 text-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800/80"
        aria-label="Delete credential"
      >
        <FiTrash2 size={14} />
      </button>
      <div>
        <h3 className="font-bold text-lg text-white">{credential.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{credential.issuer}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {credential.skills.map((skill) => (
            <span key={skill} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        {credential.filePath ? (
          <a href={credential.filePath} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-400 hover:underline">
            View Certificate <FiExternalLink className="ml-1" />
          </a>
        ) : <div />}
        <StatusBadge status={credential.status} />
      </div>
    </div>
  );
};