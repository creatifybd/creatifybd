import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  FileText, 
  CornerUpLeft, 
  Check, 
  Ban
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    draft: { color: '#9e9e9e', icon: FileText, label: 'Draft' },
    requirements_needed: { color: '#ff9800', icon: AlertCircle, label: 'Requirements Needed' },
    payment_pending: { color: '#ffc107', icon: Clock, label: 'Payment Pending' },
    payment_submitted: { color: '#00bcd4', icon: FileText, label: 'Payment Submitted' },
    payment_verified: { color: '#4caf50', icon: CheckCircle2, label: 'Payment Verified' },
    payment_rejected: { color: '#f44336', icon: XCircle, label: 'Payment Rejected' },
    in_progress: { color: '#2196f3', icon: Play, label: 'In Progress' },
    active: { color: '#2196f3', icon: Play, label: 'In Progress' }, // legacy alias
    draft_shared: { color: '#9c27b0', icon: FileText, label: 'Draft Shared' },
    delivered: { color: '#009688', icon: Check, label: 'Delivered' },
    revision_requested: { color: '#e91e63', icon: CornerUpLeft, label: 'Revision Requested' },
    revision_in_progress: { color: '#673ab7', icon: Play, label: 'Revision in Progress' },
    completed: { color: '#4caf50', icon: CheckCircle2, label: 'Completed' },
    cancelled: { color: '#f44336', icon: Ban, label: 'Cancelled' },
    rejected: { color: '#f44336', icon: XCircle, label: 'Payment Rejected' },
    // Payment verification specific
    pending: { color: '#ffc107', icon: Clock, label: 'Pending Verification' },
    verified: { color: '#4caf50', icon: CheckCircle2, label: 'Verified' }
  };

  const config = configs[status] || { color: '#777777', icon: AlertCircle, label: status || 'Unknown' };
  const Icon = config.icon;

  return (
    <div 
      className="status-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '20px',
        background: `${config.color}15`,
        border: `1.5px solid ${config.color}30`,
        color: config.color,
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        width: 'fit-content'
      }}
    >
      <Icon size={13} />
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
