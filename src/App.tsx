import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileSetupWizard } from './components/profile/ProfileSetupWizard';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CareerRecommendationsPage } from './components/careers/CareerRecommendationsPage';
import { JobRoleDetailPage } from './components/careers/JobRoleDetailPage';
import { SkillGapPage } from './components/skills/SkillGapPage';
import { LearningRoadmapPage } from './components/roadmap/LearningRoadmapPage';
import { ResumeAnalyzerPage } from './components/resume/ResumeAnalyzerPage';
import { CareerAssistantPage } from './components/assistant/CareerAssistantPage';
import { CertificationsPage } from './components/certifications/CertificationsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { JobRoleRecommendation } from './types/career';
import { LoadingState } from './components/common/LoadingState';

const MainApplication: React.FC = () => {
  const { user, loading, demoLogin } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<JobRoleRecommendation | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingState
          title="Loading Career Compass..."
          subtitle="Initializing your personalized workspace"
        />
      </div>
    );
  }

  // If user is not authenticated, show landing page with auth modal
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuth={(tab) => {
            setAuthModalTab(tab);
            setAuthModalOpen(true);
          }}
          onExploreDemo={async () => {
            await demoLogin();
            setCurrentView('dashboard');
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialTab={authModalTab}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setCurrentView('dashboard');
          }}
        />
      </>
    );
  }

  // If user is logged in for the first time with no skills configured, show Profile Setup Wizard
  const needsProfileSetup = (!user.skills || user.skills.length === 0) && !user.targetRole;
  if (needsProfileSetup) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <ProfileSetupWizard
          onComplete={() => {
            setCurrentView('dashboard');
          }}
        />
      </div>
    );
  }

  // Handle opening role detail
  const handleSelectRole = (role: JobRoleRecommendation) => {
    setSelectedRoleDetail(role);
  };

  const handleNavigate = (view: NavView) => {
    setSelectedRoleDetail(null);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <Navbar
          currentView={currentView}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 pb-16">
          {/* If viewing a specific role detail */}
          {selectedRoleDetail ? (
            <JobRoleDetailPage
              role={selectedRoleDetail}
              onBack={() => setSelectedRoleDetail(null)}
              onNavigate={handleNavigate}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardPage
                  onNavigate={handleNavigate}
                  onSelectRole={handleSelectRole}
                />
              )}

              {currentView === 'recommendations' && (
                <CareerRecommendationsPage
                  onSelectRole={handleSelectRole}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'skill-gap' && (
                <SkillGapPage onNavigate={handleNavigate} />
              )}

              {currentView === 'roadmap' && (
                <LearningRoadmapPage onNavigate={handleNavigate} />
              )}

              {currentView === 'resume-analyzer' && (
                <ResumeAnalyzerPage onNavigate={handleNavigate} />
              )}

              {currentView === 'career-assistant' && <CareerAssistantPage />}

              {currentView === 'certifications' && <CertificationsPage />}

              {currentView === 'profile' && (
                <ProfilePage onNavigate={handleNavigate} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApplication />
      </AuthProvider>
    </ThemeProvider>
  );
}
