import React, { useState } from 'react';

const PREFIX_OPTIONS = [
  'Mr.',
  'Mrs.',
  'Miss',
  'Mr. & Mrs.',
  'Family',
  'Dear'
];

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr.');
  const [name, setName] = useState('');
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const getDisplayName = (selectedPrefix: string, guestName: string) => {
    const trimmedName = guestName.trim();
    if (selectedPrefix === 'Family') {
      return `${trimmedName} and Family`;
    }
    if (selectedPrefix === 'Dear') {
      return trimmedName;
    }
    return `${selectedPrefix} ${trimmedName}`;
  };

  const handleGenerate = () => {
    if (!name.trim()) return;

    // Safely URL-encode the display name so the frontend can read the full prefix + name
    const displayName = getDisplayName(prefix, name);
    const encodedName = encodeURIComponent(displayName);
    const url = `${window.location.origin}/${encodedName}`;
    setGeneratedLink(url);

    const message = `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${url}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ Kushan & Senuri`;

    setGeneratedMessage(message);
    setCopySuccess(''); // reset success message
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleCopyMessage = async () => {
    if (!generatedMessage) return;
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopySuccess('Message copied!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy message', err);
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-50 p-6 py-12 md:py-20 font-sans overflow-y-auto w-full block">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">WhatsApp Message & Link Generator</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Prefix</label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8c244c] focus:border-[#8c244c] outline-none bg-white"
              >
                {PREFIX_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-[#8c244c] focus:border-[#8c244c] outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!name.trim()}
            className="w-full bg-[#8c244c] text-white font-bold py-3 rounded-lg hover:bg-[#c44576] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Link & Message
          </button>

          {copySuccess && (
            <div className="text-center text-sm font-medium text-green-600 bg-green-50 p-2 rounded-lg transition-all">
              {copySuccess}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-bold text-slate-800 mb-2">Preview:</label>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg min-h-[200px] whitespace-pre-wrap text-slate-700 text-sm font-medium">
              {generatedMessage ? generatedMessage : 'Your personalized message will appear here...'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCopyLink}
              disabled={!generatedLink}
              className="w-full bg-slate-100 text-slate-800 font-semibold py-3 rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Link Only
            </button>
            <button
              onClick={handleCopyMessage}
              disabled={!generatedMessage}
              className="w-full bg-slate-800 text-white font-semibold py-3 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Full Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
