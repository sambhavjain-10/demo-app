import { Modal, SkeletonLoader } from "@/components";
import type { UserInfoModalProps } from "./types";

const formatNumber = (value: number) => value.toFixed(2);

const UserInfoModal = ({ user, isOpen, onClose, isLoading }: UserInfoModalProps) => {
  const content = () => {
    if (isLoading) {
      return <SkeletonLoader lines={6} />;
    }

    if (!user) {
      return <p className="text-sm text-gray-500 dark:text-gray-400">User details unavailable.</p>;
    }

    return (
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
          <dt className="text-gray-500 dark:text-gray-400">User ID</dt>
          <dd className="font-semibold text-gray-900 dark:text-gray-100">{user.user_id}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-gray-500 dark:text-gray-400">Name</dt>
          <dd className="font-semibold text-gray-900 dark:text-gray-100">{user.first_name}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-gray-500 dark:text-gray-400">Team</dt>
          <dd className="font-semibold text-gray-900 dark:text-gray-100">{user.team}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-gray-500 dark:text-gray-400">Total Sessions</dt>
          <dd className="font-semibold text-gray-900 dark:text-gray-100">
            {user.total_sessions.toLocaleString()}
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InfoStat label="Avg Score" value={formatNumber(user.avg_score)} />
          <InfoStat label="Best Session" value={user.best_session_score.toFixed(1)} />
          <InfoStat label="Confidence" value={formatNumber(user.avg_confidence)} />
          <InfoStat label="Clarity" value={formatNumber(user.avg_clarity)} />
          <InfoStat label="Listening" value={formatNumber(user.avg_listening)} />
          <InfoStat
            label="Trend"
            value={user.recent_trend}
            className="rounded-full bg-blue-50 px-2 py-1 text-center text-xs font-semibold uppercase tracking-wide text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
          />
        </div>
      </dl>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      {content()}
    </Modal>
  );
};

const InfoStat = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className="flex flex-col rounded-2xl bg-gray-50 px-3 py-2 text-center dark:bg-gray-800/60">
    <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
      {value}
    </dd>
  </div>
);

export default UserInfoModal;
