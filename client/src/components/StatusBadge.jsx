const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('pending') || statusLower === 'not started') {
      return 'badge-pending';
    }
    if (statusLower.includes('progress') || statusLower === 'discovery' || statusLower === 'in delivery') {
      return 'badge-progress';
    }
    if (statusLower.includes('completed') || statusLower === 'implemented' || statusLower === 'approved' || statusLower === 'live') {
      return 'badge-completed';
    }
    if (statusLower === 'idea' || statusLower === 'draft') {
      return 'badge-idea';
    }
    if (statusLower === 'in review') {
      return 'badge-discovery';
    }
    if (statusLower.includes('hold')) {
      return 'badge-hold';
    }

    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
