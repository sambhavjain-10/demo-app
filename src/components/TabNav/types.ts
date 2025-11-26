export type TabItem = {
  id: string;
  label: string;
  count?: number;
};

export type TabNavProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
};
