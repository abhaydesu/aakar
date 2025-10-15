import { FiCheckCircle, FiClock, FiUser, FiTrash2, FiExternalLink, FiLoader, FiShield, FiXCircle } from "react-icons/fi";
import { Credential, CredentialStatus } from "@/types";
import { useState, useEffect } from "react";

const StatusBadge = ({ status }: { status: CredentialStatus }) => {
  const styles: Record<CredentialStatus, string> = {
    Verified: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "Self-Reported": "bg-neutral-100 text-neutral-700",
    Verifying: "bg-blue-100 text-blue-800",
    VerificationFailed: "bg-red-100 text-red-800",
  };

  const icons: Record<CredentialStatus, React.ReactNode> = {
    Verified: <FiCheckCircle className="mr-1.5" />,
    Pending: <FiClock className="mr-1.5" />,
    "Self-Reported": <FiUser className="mr-1.5" />,
    Verifying: <FiLoader className="mr-1.5 animate-spin" />,
    VerificationFailed: <FiXCircle className="mr-1.5" />,
  };

  return (
    <span
      className={
        `inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ` +
        styles[status]
      }
      aria-live="polite"
    >
      {icons[status]}
      <span className="leading-none">{status}</span>
    </span>
  );
};

const VerificationSimulator = ({ credential }: { credential: Credential }) => {
  const steps = ["Validating digital signature", "Cross-referencing with issuer", "Checking for revocation"];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [credential.id]);

  return (
    <div className="space-y-2 mt-3">
      {steps.map((step, index) => {
        const done = currentStep > index;
        const active = currentStep === index;
        return (
          <div
            key={step}
            className={`flex items-center text-sm transition-colors duration-300 ${done ? "text-green-700" : active ? "text-blue-700" : "text-neutral-500"}`}
          >
            <span className="mr-2 flex-shrink-0">
              {done ? <FiCheckCircle /> : active ? <FiLoader className="animate-spin" /> : <FiClock />}
            </span>
            <span className={done ? "font-medium" : "font-normal"}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};

export const CredentialCard = ({
  credential,
  onDelete,
}: {
  credential: Credential;
  onDelete: (credential: Credential) => void;
}) => {
  if (credential.status === "Verifying") {
    return (
      <div className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-neutral-100">
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">{credential.title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{credential.issuer}</p>
        </div>

        <div className="mt-4 border-t border-neutral-100 pt-3">
          <div className="flex items-center text-sm text-blue-700 mb-2">
            <FiShield className="mr-2" />
            <span className="font-medium">Verification in progress…</span>
          </div>

          <VerificationSimulator credential={credential} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl p-4 flex flex-col justify-between transform hover:scale-[1.01] transition-transform duration-200 shadow-sm border border-neutral-100">
      <button
        onClick={() => onDelete(credential)}
        className="absolute top-3 right-3 p-1.5 bg-red-50 text-red-700 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={`Delete ${credential.title}`}
        title="Delete credential"
      >
        <FiTrash2 size={14} />
      </button>

      <div>
        <h3 className="font-semibold text-lg text-neutral-900">{credential.title}</h3>
        <p className="text-sm text-neutral-600 mt-1">{credential.issuer}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {credential.skills?.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          {credential.fileData && credential.fileMimeType ? (
            <a
              href={`data:${credential.fileMimeType};base64,${credential.fileData}`}
              target="_blank"
              rel="noopener noreferrer"
              download={`certificate-${credential.title.replace(/\s/g, '_')}`}
              className="inline-flex items-center text-sm text-green-600 hover:underline"
              aria-label={`View certificate for ${credential.title}`}
            >
              View certificate <FiExternalLink className="ml-2" />
            </a>
          ) : (
            <span className="text-sm text-neutral-500">No file attached</span>
          )}
        </div>

        <div>
          <StatusBadge status={credential.status} />
        </div>
      </div>
    </div>
  );
};