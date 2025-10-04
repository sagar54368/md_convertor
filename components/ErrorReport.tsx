'use client';

import { useState } from 'react';
import { AlertCircle, X, Send } from 'lucide-react';

interface ErrorReportProps {
  error: Error | null;
  onClose: () => void;
}

export default function ErrorReport({ error, onClose }: ErrorReportProps) {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!error) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      // Send error report to Google Forms or your backend
      const reportData = {
        error: error.message,
        stack: error.stack,
        description,
        email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      // For now, log to console (you can integrate with Google Forms/Sheets)
      console.log('Error Report:', reportData);

      // TODO: Integrate with Google Forms submission
      // const response = await fetch('/api/report-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reportData),
      // });

      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to send error report:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-red-500/30 max-w-2xl w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-green-400 text-lg font-semibold">Report sent successfully!</p>
            <p className="text-gray-400 text-sm mt-2">Thank you for helping us improve</p>
          </div>
        ) : (
          <>
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-mono">{error.message}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What were you trying to do? (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows={3}
                  placeholder="Describe what happened..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your email (Optional - for follow-up)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-medium transition flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Report'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
