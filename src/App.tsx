import { useState } from 'react';
import { defaultDataset, type StudentRecord } from './data';
import { Navigation, type TabId } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Statistics } from './components/Statistics';
import { Charts } from './components/Charts';
import { DataTable } from './components/DataTable';
import { Insights } from './components/Insights';
import { UploadModal } from './components/UploadModal';
import { Footer } from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [dataset, setDataset] = useState<StudentRecord[]>(defaultDataset);
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUpload = (data: StudentRecord[]) => {
    setDataset(data);
    setUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation
        active={activeTab}
        onNavigate={setActiveTab}
        onUploadClick={() => setUploadOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <Dashboard data={dataset} />}
        {activeTab === 'statistics' && <Statistics data={dataset} />}
        {activeTab === 'charts' && <Charts data={dataset} />}
        {activeTab === 'dataset' && <DataTable data={dataset} />}
        {activeTab === 'insights' && <Insights data={dataset} />}
      </main>

      <Footer />

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}

export default App;
