import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-70">
        <Header />
        <main className="pt-16 p-6 h-full overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};