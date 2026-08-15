import React from 'react';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FIRESTORE_DATABASE_ID, FIREBASE_PROJECT_ID } from '../config/firebase';

export const FirebaseErrorCard: React.FC = () => {
  const { error, errorDetails, retryConnection, seedInitialDataIfEmpty, isSeeding, seedSuccessMessage } = useShop();
  const [dismissed, setDismissed] = React.useState(false);

  if (!error || dismissed) return null;

  return (
    <div className="bg-[#FFF9F0] border-b border-amber-200 px-4 py-3 text-[#25201E]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#751C2F]">
              Unable to connect to the product database.
            </h4>
            <p className="text-xs text-[#756A64] mt-0.5">
              The website UI remains functional. Target Firestore: <span className="font-mono bg-amber-50 px-1 py-0.5 rounded text-amber-900">{FIRESTORE_DATABASE_ID}</span>
            </p>
            {errorDetails && (
              <details className="mt-1 text-xs text-[#756A64]">
                <summary className="cursor-pointer text-amber-800 hover:underline">
                  Development error details
                </summary>
                <div className="mt-1 font-mono text-[11px] bg-white p-2 rounded border border-amber-200 max-w-2xl overflow-x-auto text-red-700">
                  {errorDetails}
                </div>
              </details>
            )}
            {seedSuccessMessage && (
              <div className="mt-1 text-xs text-emerald-700 font-medium">
                {seedSuccessMessage}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={retryConnection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#751C2F] text-white text-xs font-medium rounded-md hover:bg-[#591423] transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>

          <button
            onClick={seedInitialDataIfEmpty}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C7953E] text-white text-xs font-medium rounded-md hover:bg-[#a67a2e] transition-colors disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" />
            {isSeeding ? 'Syncing Catalog...' : 'Sync Catalog to Firestore'}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-2.5 py-1.5 bg-amber-100 text-amber-900 text-xs font-medium rounded-md hover:bg-amber-200 transition-colors"
            title="Dismiss warning"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
