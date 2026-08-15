import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, FIREBASE_PROJECT_ID, FIRESTORE_DATABASE_ID, auth } from '../config/firebase';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Database, RefreshCw, Play } from 'lucide-react';

export const Diagnostics: React.FC = () => {
  const { products, error, retryConnection, seedInitialDataIfEmpty, isSeeding, seedSuccessMessage } = useShop();

  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const runDatabaseDiagnostics = async () => {
    setTestStatus('running');
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Starting Firestore Diagnostic Run...`);
    logs.push(`Project ID: ${FIREBASE_PROJECT_ID}`);
    logs.push(`Named Database ID: ${FIRESTORE_DATABASE_ID}`);
    logs.push(`Auth User: ${auth.currentUser ? auth.currentUser.uid : 'Unauthenticated'}`);

    let namedDbSuccess = false;

    // Test ONLY Named Database
    try {
      const testDocRef = doc(db, 'products', 'diagnostics_ping');
      logs.push(`[NAMED DB TEST] Writing test document to 'products/diagnostics_ping' in named DB...`);
      await setDoc(testDocRef, {
        test: true,
        timestamp: serverTimestamp(),
      });
      logs.push(`✓ Named DB Write SUCCESSFUL!`);

      logs.push(`[NAMED DB TEST] Reading test document back...`);
      const snap = await getDoc(testDocRef);
      if (snap.exists()) {
        logs.push(`✓ Named DB Read SUCCESSFUL!`);
        namedDbSuccess = true;
      }

      // Cleanup
      await deleteDoc(testDocRef);
      logs.push(`✓ Named DB Cleanup SUCCESSFUL!`);
    } catch (err: any) {
      console.warn('Named DB test failed:', err);
      if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
        logs.push(`❌ Rules for the named Firestore database are not allowing the authenticated user.`);
      } else {
        logs.push(`❌ Named DB ERROR: ${err.message || String(err)}`);
      }
    }

    if (namedDbSuccess) {
      setTestStatus('success');
      logs.push(`🎉 CONGRATULATIONS! Connection verified for named database: ${FIRESTORE_DATABASE_ID}`);
    } else {
      setTestStatus('failed');
      logs.push(`❌ NAMED DATABASE TEST FAILED.`);
    }

    setTestLogs(logs);
  };

  useEffect(() => {
    runDatabaseDiagnostics();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Diagnostics Header */}
      <div className="bg-[#751C2F] text-white p-6 rounded-2xl border border-[#C7953E]/40 space-y-2">
        <div className="flex items-center gap-2 text-[#C7953E] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Amax Craft System Health & Firebase Inspector</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF9F0]">
          Database Diagnostics & Status
        </h1>
        <p className="text-xs text-[#F4E3DD]">
          Verifying live web preview connectivity to named Firestore database.
        </p>
      </div>

      {/* Summary Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-[#F4E3DD] space-y-1">
          <span className="text-[#756A64] block font-medium">Firebase Project ID</span>
          <span className="font-mono font-bold text-[#25201E] block">{FIREBASE_PROJECT_ID}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F4E3DD] space-y-1">
          <span className="text-[#756A64] block font-medium">Named Firestore Database ID</span>
          <span className="font-mono font-bold text-[#751C2F] block">{FIRESTORE_DATABASE_ID}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F4E3DD] space-y-1">
          <span className="text-[#756A64] block font-medium">Active Products Received</span>
          <span className="font-serif font-bold text-lg text-emerald-700 block">{products.length} Items</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F4E3DD] space-y-1">
          <span className="text-[#756A64] block font-medium">Connection Status</span>
          <span className={`font-bold block ${error ? 'text-red-600' : 'text-emerald-700'}`}>
            {error ? 'Connection Warning' : 'Connected & Syncing'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="bg-white p-6 rounded-xl border border-[#F4E3DD] space-y-4">
        <h3 className="font-serif font-bold text-[#751C2F] text-base border-b border-[#F4E3DD] pb-2">
          Diagnostic Controls & Data Synchronization
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={runDatabaseDiagnostics}
            disabled={testStatus === 'running'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testStatus === 'running' ? 'Testing Connection...' : 'Run Database Ping Test'}</span>
          </button>

          <button
            onClick={seedInitialDataIfEmpty}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C7953E] text-white text-xs font-bold rounded-lg hover:bg-[#a67a2e]"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSeeding ? 'Syncing Catalog...' : 'Sync Catalog to Firestore'}</span>
          </button>

          <button
            onClick={retryConnection}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4E3DD] text-[#751C2F] text-xs font-bold rounded-lg hover:bg-[#ebd5cd]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconnect Snapshots</span>
          </button>
        </div>

        {seedSuccessMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-semibold">
            {seedSuccessMessage}
          </div>
        )}
      </div>

      {/* Diagnostic Log Output */}
      <div className="bg-black text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-2 border border-gray-800 overflow-x-auto">
        <div className="text-gray-400 font-bold border-b border-gray-800 pb-2 flex items-center justify-between">
          <span>CONSOLE DIAGNOSTIC LOGS</span>
          <span className="uppercase text-[10px]">{testStatus}</span>
        </div>
        <div className="space-y-1 leading-relaxed min-h-32">
          {testLogs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
