import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Zap, Globe, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { getStoredKeys, saveKeys, getProviderStatus } from '../../utils/aiRotator';

const PROVIDER_INFO = {
  groq: {
    name: 'Groq',
    icon: '⚡',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FED7AA',
    rpd: 14400,
    model: 'Llama 3.1 8B (8,000 tok/s)',
    signup: 'https://console.groq.com',
    keyPrefix: 'gsk_',
    steps: [
      'Go to console.groq.com',
      'Sign up with Google (free, no credit card)',
      'Click "API Keys" in the left sidebar',
      'Click "Create API Key"',
      'Copy and paste the key here',
    ],
  },
  openrouter: {
    name: 'OpenRouter',
    icon: '🌐',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    rpd: 1000,
    model: 'Llama 3.2 / Mistral 7B (free)',
    signup: 'https://openrouter.ai/keys',
    keyPrefix: 'sk-or-',
    steps: [
      'Go to openrouter.ai',
      'Sign up for free',
      'Go to openrouter.ai/keys',
      'Create a new API key',
      'Paste it here',
    ],
  },
  gemini: {
    name: 'Gemini',
    icon: '✦',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    rpd: 1500,
    model: 'gemini-2.0-flash-lite',
    signup: 'https://aistudio.google.com/apikey',
    keyPrefix: 'AIzaSy',
    steps: [
      'Go to aistudio.google.com/apikey',
      'Sign in with Google',
      'Click "Create API key"',
      'Copy and paste here',
    ],
  },
};

function KeyRow({ keyVal, onDelete }) {
  const masked = keyVal.length > 12
    ? keyVal.slice(0, 8) + '••••••••' + keyVal.slice(-4)
    : '••••••••';
  const [copied, setCopied] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      background: '#F8FAFC', border: '1px solid #E2E8F0',
      borderRadius: '8px', padding: '0.5rem 0.75rem',
      fontSize: '0.82rem', fontFamily: 'monospace',
    }}>
      <CheckCircle2 size={14} color="#22C55E" style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, color: '#334155' }}>{masked}</span>
      <button onClick={() => { navigator.clipboard.writeText(keyVal); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#22C55E' : '#94A3B8', padding: '0 4px' }}>
        {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
      </button>
      <button onClick={() => onDelete(keyVal)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0 4px' }}>
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function ProviderPanel({ providerId, info, keys, onKeysChange }) {
  const [newKey, setNewKey] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const addKey = () => {
    const trimmed = newKey.trim();
    if (!trimmed || keys.includes(trimmed)) return;
    const updated = [...keys, trimmed];
    onKeysChange(providerId, updated);
    setNewKey('');
  };

  const deleteKey = (key) => {
    onKeysChange(providerId, keys.filter(k => k !== key));
  };

  const dailyCapacity = info.rpd * keys.length;

  return (
    <div style={{
      background: info.bg, border: `1px solid ${info.border}`,
      borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '1.1rem' }}>{info.icon}</span>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>{info.name}</h3>
            {providerId === 'groq' && (
              <span style={{ background: '#F97316', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '2px 6px', borderRadius: '20px' }}>
                RECOMMENDED
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
            {info.model} · <strong style={{ color: info.color }}>{info.rpd.toLocaleString()} req/day/key</strong>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: info.color }}>{keys.length}</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>keys added</div>
        </div>
      </div>

      {/* Capacity bar */}
      {dailyCapacity > 0 && (
        <div style={{ background: '#fff', border: `1px solid ${info.border}`, borderRadius: '8px', padding: '0.5rem 0.75rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', marginBottom: '4px' }}>
            <span>Daily Capacity</span>
            <strong style={{ color: info.color }}>{dailyCapacity.toLocaleString()} requests/day</strong>
          </div>
          <div style={{ background: '#E2E8F0', borderRadius: '4px', height: '4px' }}>
            <div style={{ background: info.color, height: '4px', borderRadius: '4px', width: `${Math.min(100, (dailyCapacity / 144000) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Existing keys */}
      {keys.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {keys.map((k, i) => <KeyRow key={i} keyVal={k} onDelete={deleteKey} />)}
        </div>
      )}

      {/* Add key input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addKey()}
          placeholder={`Paste ${info.name} API key (starts with ${info.keyPrefix}...)`}
          style={{
            flex: 1, padding: '0.5rem 0.75rem', border: `1px solid ${info.border}`,
            borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace',
            background: '#fff', outline: 'none', color: '#1E293B',
          }}
        />
        <button onClick={addKey} style={{
          background: info.color, color: '#fff', border: 'none',
          borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: '700',
        }}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Signup guide toggle */}
      <div>
        <button onClick={() => setShowSteps(v => !v)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: info.color, fontSize: '0.78rem', fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
        }}>
          {showSteps ? '▲' : '▼'} How to get a free {info.name} API key
        </button>
        {showSteps && (
          <div style={{ marginTop: '0.5rem', background: '#fff', border: `1px solid ${info.border}`, borderRadius: '8px', padding: '0.75rem' }}>
            <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {info.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <a href={info.signup} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem',
              color: info.color, fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none',
            }}>
              <ExternalLink size={12} /> Open {info.name} Console
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIKeysManager() {
  const [keys, setKeys] = useState({ groq: [], openrouter: [], gemini: [] });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeys({
      groq: getStoredKeys('groq'),
      openrouter: getStoredKeys('openrouter'),
      gemini: getStoredKeys('gemini'),
    });
  }, []);

  const handleKeysChange = (provider, newKeys) => {
    setKeys(prev => {
      const updated = { ...prev, [provider]: newKeys };
      saveKeys(provider, newKeys);
      return updated;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalDailyCapacity =
    keys.groq.length * 14400 +
    keys.openrouter.length * 1000 +
    keys.gemini.length * 1500;

  const totalKeys = keys.groq.length + keys.openrouter.length + keys.gemini.length;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#F97316', padding: '0.5rem', borderRadius: '10px', color: '#fff' }}>
          <Key size={20} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>AI Keys Manager</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            Configure Groq, OpenRouter & Gemini keys · Auto-rotates for maximum capacity
          </p>
        </div>
        {saved && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#22C55E', fontSize: '0.85rem', fontWeight: '700' }}>
            <CheckCircle2 size={16} /> Saved!
          </div>
        )}
      </div>

      {/* Summary card */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
        color: '#fff',
      }}>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F97316' }}>{totalKeys}</div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total API Keys</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#22C55E' }}>
            {totalDailyCapacity > 0 ? totalDailyCapacity.toLocaleString() : '0'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Requests/Day</div>
        </div>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60A5FA' }}>
            {totalDailyCapacity > 0 ? Math.ceil(51090 / totalDailyCapacity) : '∞'}d
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>To Study All 51K Leads</div>
        </div>
      </div>

      {totalKeys === 0 && (
        <div style={{
          background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px',
          padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} color="#92400E" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '0.85rem', color: '#92400E' }}>
            <strong>No AI keys configured.</strong> Add at least one Groq API key to enable AI Business Study.
            Groq is free, requires no credit card, and gives 14,400 requests/day per key.
          </div>
        </div>
      )}

      {/* Provider panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Object.entries(PROVIDER_INFO).map(([id, info]) => (
          <ProviderPanel
            key={id}
            providerId={id}
            info={info}
            keys={keys[id] || []}
            onKeysChange={handleKeysChange}
          />
        ))}
      </div>

      {/* Bottom note */}
      <div style={{
        marginTop: '1.25rem', padding: '0.75rem 1rem', background: '#F0FDF4',
        border: '1px solid #BBF7D0', borderRadius: '10px', fontSize: '0.8rem', color: '#166534',
      }}>
        <strong>🔒 Privacy:</strong> API keys are stored only in your browser's localStorage — never sent to any server except the respective AI provider.
        Keys are used directly from your browser for AI calls.
      </div>
    </div>
  );
}
