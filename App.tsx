import React, { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, ShieldCheck, UserIcon, Key, LogOut, X, Save, BookOpen, Edit3, Globe, Settings, Database, Wifi, FileText, HardDrive, RefreshCw, Trash2, Gift, Copy, Loader2, Sparkles, CheckCircle, Zap } from 'lucide-react';
// @ts-ignore
import confetti from 'https://esm.sh/canvas-confetti@1.9.2';
import { AppState, User, UserRole, UserLog, AccessKey, Question, EssayTopic } from './types';
import { getAllUsers, saveUser, deleteUser, testDBConnection, saveLoginLog, getLoginLogs, getAccessKeys, validateAccessKey, deleteAccessKey, claimGiftAndCreateStudent, loginStudent, rememberUser, getPersistedUser, clearPersistedUser } from './services/storageService';
import Dashboard from './pages/Dashboard';
import { ExamSimulator } from './pages/ExamSimulator';
import ExampleViewer from './pages/ExampleViewer';
import { EXAM_TOPICS } from './data/examQuestions';

// --- HELPERS ---
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied: " + text);
  }).catch(console.error);
};

const getPlatformName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) return "Microsoft Edge";
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  return "Unknown";
};

// --- COMPONENTS ---

const LoginSelectionScreen = ({ setAppState }: { setAppState: (s: AppState) => void }) => (
  <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col items-center justify-center p-6">
    {/* Animated Background */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-8 border border-white/10 relative z-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="inline-flex bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-lg shadow-indigo-500/30 mb-2">
        <GraduationCap className="w-12 h-12 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">IELTS Writing AI</h1>
        <p className="text-slate-300 mt-3 font-medium text-lg">Master your writing. Score higher.</p>
      </div>

      <div className="space-y-4 pt-4">
        <button
          onClick={() => setAppState(AppState.STUDENT_AUTH)}
          className="w-full py-4 px-6 bg-white hover:bg-indigo-50 text-indigo-900 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl transform hover:-translate-y-1"
        >
          <UserIcon size={22} className="text-indigo-600" />
          Login
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setAppState(AppState.GET_KEY_AUTH)}
            className="w-full py-4 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Key size={18} /> Get Keys
          </button>
          <button
            onClick={() => setAppState(AppState.ADMIN_LOGIN)}
            className="w-full py-4 px-4 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 border border-slate-600/50 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <ShieldCheck size={18} /> Admin
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-6">Powered by Gemini AI</p>
    </div>
  </div>
);

const GetKeyAuthScreen = ({ setAppState, handleKeyLogin }: any) => {
  const [form, setForm] = useState({ login: '', pass: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await handleKeyLogin(form.login, form.pass);
    if (!success) setError('Invalid credential.');
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0f172a] to-[#0f172a] z-0"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-700 relative z-10">
        <div className="flex items-center mb-8">
          <button onClick={() => setAppState(AppState.LOGIN_SELECTION)} className="text-slate-400 hover:text-white mr-3 p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft />
          </button>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Key className="text-amber-500 fill-amber-500" /> Get Keys
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-500 uppercase tracking-wider ml-1">Login ID</label>
            <input
              type="text"
              required
              value={form.login}
              onChange={(e: any) => setForm({ ...form, login: e.target.value })}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-white transition-all placeholder:text-slate-600"
              placeholder="loginXX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-500 uppercase tracking-wider ml-1">Password</label>
            <input
              type="text"
              required
              value={form.pass}
              onChange={(e: any) => setForm({ ...form, pass: e.target.value })}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-white transition-all placeholder:text-slate-600"
              placeholder="*******"
            />
          </div>
          {error && <div className="p-3 bg-red-900/30 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-900/50"><X size={16} />{error}</div>}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-900/20 transform active:scale-95"
          >
            Access Gift Portal
          </button>
        </form>
      </div>
    </div>
  );
}

const GetKeyDashboard = ({ activeKey, handleLogout }: { activeKey: AccessKey, handleLogout: () => void }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [generatedUser, setGeneratedUser] = useState<User | null>(null);

  const handleClaim = async () => {
    setIsActivating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newUser = await claimGiftAndCreateStudent(activeKey.id);
    setGeneratedUser(newUser);

    if (newUser) {
      rememberUser(newUser.id);
    }

    setIsActivating(false);

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <header className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg shadow-lg shadow-pink-500/20">
              <Gift className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Gift Portal</h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 text-sm font-medium">
            <LogOut size={16} /> Exit
          </button>
        </header>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-1 border border-slate-700/50 shadow-2xl">
          <div className="bg-slate-900 rounded-[1.4rem] p-8 sm:p-12 text-center relative overflow-hidden">
            {!generatedUser ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30 ring-4 ring-slate-800">
                  <Gift size={48} className="animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Unwrap Premium Access</h2>
                <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed text-lg">
                  Your unlimited IELTS preparation journey begins here.
                </p>
                <button
                  onClick={handleClaim}
                  disabled={isActivating}
                  className="w-full py-5 bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl font-bold text-xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isActivating ? (
                    <> <Loader2 className="animate-spin text-indigo-600" /> Generating...</>
                  ) : (
                    <> <Sparkles size={24} className="text-indigo-600" fill="currentColor" /> CLAIM NOW </>
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/40">
                  <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                <p className="text-emerald-400 font-bold mb-8 text-sm uppercase tracking-widest">
                  Premium Account Active
                </p>

                <div className="bg-black/40 rounded-2xl border border-white/5 p-6 text-left mb-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider ml-1">Your Username</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center font-mono text-xl text-white tracking-wide">
                        {generatedUser.username}
                      </div>
                      <button onClick={() => copyToClipboard(generatedUser.username || '')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300">
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] uppercase font-bold tracking-wider ml-1">Your Password</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center font-mono text-xl text-emerald-400 tracking-wide">
                        {generatedUser.password}
                      </div>
                      <button onClick={() => copyToClipboard(generatedUser.password || '')} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300">
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm font-medium underline underline-offset-4 transition-all">
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminLoginScreen = ({ adminLogin, setAdminLogin, handleAdminLogin, setAppState }: any) => (
  <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
    <div className="bg-slate-800 p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-700">
      <div className="flex items-center mb-8">
        <button onClick={() => setAppState(AppState.LOGIN_SELECTION)} className="text-slate-400 hover:text-white mr-3 p-2 hover:bg-slate-700 rounded-full transition-colors">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-bold text-white">Admin Access</h2>
      </div>
      <form onSubmit={handleAdminLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Username</label>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={adminLogin.login}
            onChange={(e: any) => setAdminLogin({ ...adminLogin, login: e.target.value })}
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all"
            placeholder="Enter Admin Login"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={adminLogin.password}
            onChange={(e: any) => setAdminLogin({ ...adminLogin, password: e.target.value })}
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white transition-all"
            placeholder="Enter Admin Password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30"
        >
          Authenticate
        </button>
      </form>
    </div>
  </div>
);

const AdminDashboard = ({
  handleLogout,
  users,
  setUsers,
  material,
  setMaterial,
  handleSaveMaterial,
  handleDeleteUser,
  handleGiftPremium,
  aiPrompt,
  setAiPrompt,
  handleSavePrompt,
  handleRefreshUsers
}: any) => {
  const [activeTab, setActiveTab] = useState<'users' | 'keys' | 'material' | 'prompt' | 'database' | 'logs'>('users');
  const [dbStatus, setDbStatus] = useState<string>("");
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([]);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    refreshLogs();
    refreshKeys();
    const savedKey = localStorage.getItem('custom_api_key');
    if (savedKey) setApiKeyInput(savedKey);
  }, []);

  const handleSaveKey = () => {
    if (!apiKeyInput.trim()) return;
    localStorage.setItem('custom_api_key', apiKeyInput.trim());
    alert("Gemini API Key Saved Successfully!\nThe app will now use this key.");
  };

  const refreshLogs = async () => {
    const data = await getLoginLogs();
    setLogs(data);
  }

  const refreshKeys = async () => {
    const keys = await getAccessKeys();
    setAccessKeys(keys);
  }

  const handleDeleteKey = async (id: string) => {
    await deleteAccessKey(id);
    refreshKeys();
  }

  const handleTestConnection = async () => {
    setDbStatus("Checking storage...");
    const result = await testDBConnection();
    setDbStatus(result.message);
    handleRefreshUsers();
    refreshLogs();
    refreshKeys();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold text-lg hidden sm:inline">Admin Panel</span>
        </div>
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
          <button onClick={() => setActiveTab('users')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'users' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>Users</button>
          <button onClick={() => setActiveTab('keys')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 ${activeTab === 'keys' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <Key size={14} /> Keys
          </button>
          <button onClick={() => setActiveTab('logs')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 ${activeTab === 'logs' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <FileText size={14} /> Logs
          </button>
          <button onClick={() => setActiveTab('material')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'material' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>Material</button>
          <button onClick={() => setActiveTab('prompt')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${activeTab === 'prompt' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>AI & Settings</button>
          <button onClick={() => setActiveTab('database')} className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm flex items-center gap-1 ${activeTab === 'database' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <Database size={14} /> Storage
          </button>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm ml-2">
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">

        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" /> User Management
              </h2>
              <button
                onClick={handleRefreshUsers}
                className="text-slate-600 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
                title="Refresh User List"
              >
                <span className="text-xs font-medium">Sync</span>
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-100 text-slate-600 text-sm rounded-lg flex items-center gap-2">
              <HardDrive size={16} /> <b>Local Storage Mode</b> (Data saved in this browser)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">User Info</th>
                    <th className="px-4 py-3">Login Details</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3 text-center">Logins</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.filter((u: User) => u.role === UserRole.USER).map((user: User) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {user.name} {user.surname}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                        {user.username} <br />
                        <span className="text-slate-400">{user.password}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Globe size={12} />
                          {user.registrationSource || "Unknown"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 font-semibold">
                        {user.loginCount || 0}
                      </td>
                      <td className="px-4 py-3">
                        {user.isPaid ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Premium</span>
                        ) : (
                          user.giftPending ?
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 animate-pulse">Gift Sent</span>
                            :
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Free</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {!user.isPaid && !user.giftPending && (
                          <button
                            onClick={() => handleGiftPremium(user.id)}
                            className="text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded border border-indigo-200 inline-flex items-center gap-1"
                            title="Gift Premium Access"
                          >
                            <Gift size={12} /> Gift
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200 inline-flex items-center gap-1"
                          title="Delete User Account"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.filter((u: User) => u.role === UserRole.USER).length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" /> One-Time Access Keys
              </h2>
            </div>

            <p className="text-slate-500 text-sm mb-4">
              List of available keys. Each key maps to a specific Premium Account.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Login</th>
                    <th className="px-4 py-3">Password</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accessKeys.map((key: any) => (
                    <tr key={key.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{key.login}</td>
                      <td className="px-4 py-3 font-mono text-indigo-600">{key.pass}</td>
                      <td className="px-4 py-3 text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded inline-block w-fit">Active (Unlimited)</span>
                          <span className="text-slate-400 text-[10px] font-mono">Usage: {key.usageCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() => copyToClipboard(`${key.login} | ${key.pass}`)}
                          className="text-slate-400 hover:text-indigo-600"
                          title="Copy"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {accessKeys.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">No keys initialized.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Audit Logs (Local)
              </h2>
              <button
                onClick={refreshLogs}
                className="text-slate-600 hover:text-indigo-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left font-mono">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Email / Username</th>
                    <th className="px-4 py-3">Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {log.email}
                      </td>
                      <td className="px-4 py-3 text-indigo-600">
                        {log.password}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic">No logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'material' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Exam Content
            </h2>
            <textarea
              className="flex-1 w-full p-4 border border-slate-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 min-h-[400px]"
              value={material}
              onChange={(e: any) => setMaterial(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button onClick={handleSaveMaterial} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium">
                <Save size={18} /> Save Content
              </button>
            </div>
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" /> AI Agent Instructions
              </h2>
              <textarea
                className="flex-1 w-full p-4 border border-slate-200 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-green-400 min-h-[300px]"
                value={aiPrompt}
                onChange={(e: any) => setAiPrompt(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <button onClick={handleSavePrompt} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium">
                  <Save size={18} /> Update Agent
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600" /> Server Configuration
                </h2>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 mb-4">
                  <Globe className="inline w-4 h-4 mr-1" />
                  <b>Gemini AI</b>: Active (User Key)
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Custom Gemini API Key</label>
                  <p className="text-xs text-slate-400">Enter your key here if you see "API Key Missing" errors.</p>
                  <input
                    type="text"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIza..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    onClick={handleSaveKey}
                    className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-indigo-600" /> Data Storage
            </h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-sm text-slate-600 space-y-3">
              <p className="font-bold text-slate-800">Status:</p>
              <p>
                Running in <b>Local Storage Mode</b>. User data and logs are saved in your browser's memory.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleTestConnection}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Wifi size={20} /> Verify Storage
                </button>
              </div>
              {dbStatus && (
                <div className={`p-3 rounded-lg text-center font-bold text-sm bg-green-100 text-green-800`}>
                  {dbStatus}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StudentAuthScreen = ({ authMode, setAuthMode, studentForm, setStudentForm, handleStudentAuth, setAppState }: any) => (
  <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col items-center justify-center p-6">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    <div className="bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center mb-8">
        <button onClick={() => setAppState(AppState.LOGIN_SELECTION)} className="text-slate-400 hover:text-white mr-3 p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {authMode === 'SIGN_IN' ? 'Student Login' : 'Join Us'}
        </h2>
      </div>

      <div className="flex p-1.5 bg-black/20 rounded-2xl mb-8 border border-white/5">
        <button
          onClick={() => setAuthMode('SIGN_IN')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === 'SIGN_IN' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Log In
        </button>
        <button
          onClick={() => setAuthMode('SIGN_UP')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === 'SIGN_UP' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleStudentAuth} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {authMode === 'SIGN_UP' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Name</label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="w-full p-4 bg-slate-950/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-white placeholder:text-slate-600"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Surname</label>
              <input
                type="text"
                required
                value={studentForm.surname}
                onChange={(e) => setStudentForm({ ...studentForm, surname: e.target.value })}
                className="w-full p-4 bg-slate-950/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-white placeholder:text-slate-600"
                placeholder="Doe"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Username / ID</label>
          <input
            type="text"
            required
            value={studentForm.username}
            onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
            className="w-full p-4 bg-slate-950/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-white placeholder:text-slate-600"
            placeholder="student_id"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Password</label>
          <input
            type="password"
            required
            value={studentForm.password}
            onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
            className="w-full p-4 bg-slate-950/50 border border-slate-700/50 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium text-white placeholder:text-slate-600"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-900/40 transform active:scale-[0.98] mt-2 border border-white/10"
        >
          {authMode === 'SIGN_IN' ? 'Start Practicing' : 'Create Account'}
        </button>
      </form>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN_SELECTION);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeAccessKey, setActiveAccessKey] = useState<AccessKey | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<EssayTopic | null>(null);

  const [adminLogin, setAdminLogin] = useState({ login: '', password: '' });
  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [studentForm, setStudentForm] = useState({ name: '', surname: '', username: '', password: '' });
  const [material, setMaterial] = useState(JSON.stringify(EXAM_TOPICS, null, 2));
  const [aiPrompt, setAiPrompt] = useState('You are an IELTS Writing examiner.');

  useEffect(() => {
    loadUsers();
    checkAutoLogin();
  }, []);

  const loadUsers = async () => {
    const loadedUsers = await getAllUsers();
    setUsers(loadedUsers);
  };

  const checkAutoLogin = async () => {
    const persistedUser = await getPersistedUser();
    if (persistedUser) {
      setCurrentUser(persistedUser);
      if (persistedUser.role === UserRole.ADMIN) {
        setAppState(AppState.ADMIN);
      } else {
        setAppState(AppState.SESSION);
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin.login === 'Odilxon' && adminLogin.password === 'Xon7') {
      const adminUser: User = {
        id: 'admin-master', name: 'Admin', surname: 'Master',
        role: UserRole.ADMIN, isPaid: true, registrationDate: Date.now(), questionsAnswered: 0
      };
      setCurrentUser(adminUser);
      rememberUser(adminUser.id);
      setAppState(AppState.ADMIN);
      setAdminLogin({ login: '', password: '' });
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const handleKeyLogin = async (login: string, pass: string): Promise<boolean> => {
    await saveLoginLog(login, '******');
    const key = await validateAccessKey(login, pass);
    if (key) {
      setActiveAccessKey(key);
      setAppState(AppState.GET_KEY_DASHBOARD);
      return true;
    }
    return false;
  }

  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveLoginLog(studentForm.username, studentForm.password);

    if (authMode === 'SIGN_UP') {
      const currentUsers = await getAllUsers();
      if (currentUsers.find(u => u.username === studentForm.username)) {
        alert("User already exists");
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        name: studentForm.name,
        surname: studentForm.surname,
        username: studentForm.username,
        password: studentForm.password,
        role: UserRole.USER,
        isPaid: false,
        registrationDate: Date.now(),
        questionsAnswered: 0,
        loginCount: 1,
        registrationSource: getPlatformName()
      };

      await saveUser(newUser);
      setUsers([...currentUsers, newUser]);
      setCurrentUser(newUser);
      rememberUser(newUser.id);
      setAppState(AppState.SESSION);
    } else {
      const user = await loginStudent(studentForm.username, studentForm.password);

      if (user) {
        const updatedUser = { ...user, loginCount: (user.loginCount || 0) + 1 };
        await saveUser(updatedUser);

        const allUsers = await getAllUsers();
        setUsers(allUsers);

        setCurrentUser(updatedUser);
        rememberUser(updatedUser.id);
        setAppState(AppState.SESSION);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  const handleLogout = () => {
    clearPersistedUser();
    setCurrentUser(null);
    setSelectedTopic(null);
    setAppState(AppState.LOGIN_SELECTION);
    setActiveAccessKey(null);
  };

  const handleStartExam = (topic: EssayTopic) => {
    setSelectedTopic(topic);
  };

  const handleBackToDashboard = () => {
    setSelectedTopic(null);
  };

  const handleViewExample = (topic: EssayTopic) => {
    setViewingExample(topic);
  };

  const handleBackFromExample = () => {
    setViewingExample(null);
  };

  return (
    <>
      {/* ROUTING */}
      {appState === AppState.LOGIN_SELECTION && <LoginSelectionScreen setAppState={setAppState} />}
      {appState === AppState.GET_KEY_AUTH && <GetKeyAuthScreen setAppState={setAppState} handleKeyLogin={handleKeyLogin} />}
      {appState === AppState.GET_KEY_DASHBOARD && activeAccessKey && <GetKeyDashboard activeKey={activeAccessKey} handleLogout={() => { setActiveAccessKey(null); setAppState(AppState.LOGIN_SELECTION); }} />}

      {appState === AppState.STUDENT_AUTH && (
        <StudentAuthScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          studentForm={studentForm}
          setStudentForm={setStudentForm}
          handleStudentAuth={handleStudentAuth}
          setAppState={setAppState}
        />
      )}

      {appState === AppState.ADMIN_LOGIN && (
        <AdminLoginScreen
          adminLogin={adminLogin}
          setAdminLogin={setAdminLogin}
          handleAdminLogin={handleAdminLogin}
          setAppState={setAppState}
        />
      )}

      {appState === AppState.ADMIN && (
        <AdminDashboard
          handleLogout={handleLogout}
          users={users}
          setUsers={setUsers}
          material={material}
          setMaterial={setMaterial}
          handleSaveMaterial={() => alert("Material Saved locally (memory)")}
          handleDeleteUser={(id: string) => {
            if (window.confirm("Are you sure?")) {
              deleteUser(id).then(() => getAllUsers().then(setUsers));
            }
          }}
          handleGiftPremium={async (id: string) => {
            const u = users.find(x => x.id === id);
            if (u) {
              const updated = { ...u, giftPending: true };
              await saveUser(updated);
              loadUsers();
            }
          }}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          handleSavePrompt={() => alert("Prompt Saved")}
          handleRefreshUsers={loadUsers}
        />
      )}

      {appState === AppState.SESSION && currentUser && (
        viewingExample ? (
          <ExampleViewer
            topic={viewingExample}
            onBack={handleBackFromExample}
          />
        ) : selectedTopic ? (
          <ExamSimulator
            currentUser={currentUser}
            topic={selectedTopic}
            onBack={handleBackToDashboard}
            apiKey={localStorage.getItem('custom_api_key') || undefined}
          />
        ) : (
          <Dashboard
            currentUser={currentUser}
            onStartExam={handleStartExam}
            onViewExample={handleViewExample}
            onLogout={handleLogout}
          />
        )
      )}
    </>
  );
};

export default App;