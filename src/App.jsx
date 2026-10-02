import React, { useState, useEffect, useMemo } from 'react';
import EmojiPicker from 'emoji-picker-react';

// === INLINE SVG ICONS ===
const IconStar = ({ className = "w-5 h-5 text-yellow-400" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconMoon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const IconSun = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconEye = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconEyeOff = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.858A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
  </svg>
);

const IconPrinter = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

// Component hiển thị Avatar (chứa ảnh thật hoặc Emoji)
const AvatarDisplay = ({ avatar, className = "" }) => {
  if (avatar?.startsWith('data:image')) {
    return <img src={avatar} alt="Avatar" className={`object-cover rounded-full ${className}`} />;
  }
  return <span className={`flex items-center justify-center ${className}`}>{avatar}</span>;
};

// Danh sách Avatar gợi ý nhanh
const AVATAR_OPTIONS = ['👦', '👧', '🐶', '🐱', '🦊', '🦁', '🐼', '🐸', '🦄', '🚀', '👑', '🌟'];

// Helper lấy ID tuần (VD: 2026-W40)
const getWeekId = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo < 10 ? '0' + weekNo : weekNo}`;
};

export default function KidTracker() {
  // --- STATE SYSTEM ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('kt_user')) || null);
  const [authMode, setAuthMode] = useState('login'); 
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Config UI
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('kt_dark') === 'true');
  const [currentTab, setCurrentTab] = useState('tasks'); 
  const [emojiPickerTarget, setEmojiPickerTarget] = useState(null); // { type: 'task'|'reward', id: string }

  // Profile bé
  const [childName, setChildName] = useState(() => localStorage.getItem('kt_child_name') || 'Bé Ngoan');
  const [childAvatar, setChildAvatar] = useState(() => localStorage.getItem('kt_child_avatar') || '👦');
  const [totalStars, setTotalStars] = useState(() => parseInt(localStorage.getItem('kt_total_stars') || '10'));
  const [weeklyGoal, setWeeklyGoal] = useState(() => parseInt(localStorage.getItem('kt_weekly_goal') || '20'));

  // Data Quản lý
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('kt_tasks')) || [
    { id: 't1', name: 'Đánh răng sáng tối', icon: '🪥' },
    { id: 't2', name: 'Dọn dẹp đồ chơi', icon: '🧸' },
    { id: 't3', name: 'Ăn hết phần cơm', icon: '🍚' },
    { id: 't4', name: 'Làm bài tập', icon: '✏️' },
    { id: 't5', name: 'Chào hỏi lễ phép', icon: '🙇‍♂️' },
  ]);

  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem('kt_rewards')) || [
    { id: 'r1', name: 'Xem hoạt hình 15 phút', icon: '📺', cost: 5 },
    { id: 'r2', name: 'Đi nhà sách mua truyện', icon: '📚', cost: 15 },
    { id: 'r3', name: 'Đi chơi công viên', icon: '🎡', cost: 20 },
    { id: 'r4', name: 'Mua đồ chơi nhỏ', icon: '🚗', cost: 30 },
  ]);

  // Quản lý tuần & Chấm điểm
  const currentRealWeek = getWeekId();
  const [selectedWeek, setSelectedWeek] = useState(currentRealWeek);
  const [weeklyMatrix, setWeeklyMatrix] = useState(() => JSON.parse(localStorage.getItem('kt_weekly_matrix')) || {});

  // Lịch sử thưởng phạt & đổi quà
  const [bonusHistory, setBonusHistory] = useState(() => JSON.parse(localStorage.getItem('kt_bonus_history')) || []);
  const [redeemHistory, setRedeemHistory] = useState(() => JSON.parse(localStorage.getItem('kt_redeem_history')) || []);

  const [bonusPoints, setBonusPoints] = useState(1);
  const [bonusReason, setBonusReason] = useState('');

  const [leaderboardWeek, setLeaderboardWeek] = useState(currentRealWeek);

  // --- PERSISTENCE (LƯU LOCAL) ---
  useEffect(() => {
    localStorage.setItem('kt_dark', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (user) localStorage.setItem('kt_user', JSON.stringify(user));
    else localStorage.removeItem('kt_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kt_child_name', childName);
    localStorage.setItem('kt_child_avatar', childAvatar);
    localStorage.setItem('kt_total_stars', totalStars);
    localStorage.setItem('kt_weekly_goal', weeklyGoal);
    localStorage.setItem('kt_tasks', JSON.stringify(tasks));
    localStorage.setItem('kt_rewards', JSON.stringify(rewards));
    localStorage.setItem('kt_weekly_matrix', JSON.stringify(weeklyMatrix));
    localStorage.setItem('kt_bonus_history', JSON.stringify(bonusHistory));
    localStorage.setItem('kt_redeem_history', JSON.stringify(redeemHistory));
  }, [childName, childAvatar, totalStars, weeklyGoal, tasks, rewards, weeklyMatrix, bonusHistory, redeemHistory]);

  // --- HANDLERS ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!usernameInput.trim()) return setAuthError('Vui lòng nhập tên đăng nhập!');
    if (passwordInput.length < 6) return setAuthError('Mật khẩu phải có ít nhất 6 ký tự!');

    const registeredUsers = JSON.parse(localStorage.getItem('kt_registered_users') || '{}');
    if (authMode === 'register') {
      if (registeredUsers[usernameInput.toLowerCase()]) return setAuthError('Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!');
      registeredUsers[usernameInput.toLowerCase()] = { password: passwordInput, name: usernameInput };
      localStorage.setItem('kt_registered_users', JSON.stringify(registeredUsers));
      setUser({ username: usernameInput });
      setChildName(usernameInput);
    } else {
      const existingUser = registeredUsers[usernameInput.toLowerCase()];
      if (!existingUser || existingUser.password !== passwordInput) return setAuthError('Tên đăng nhập hoặc mật khẩu không chính xác!');
      setUser({ username: usernameInput });
      setChildName(existingUser.name || usernameInput);
    }
  };

  const handleLogout = () => setUser(null);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setChildAvatar(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emojiData) => {
    if (!emojiPickerTarget) return;
    const { type, id } = emojiPickerTarget;
    
    if (type === 'task') {
      setTasks(tasks.map(t => t.id === id ? { ...t, icon: emojiData.emoji } : t));
    } else if (type === 'reward') {
      setRewards(rewards.map(r => r.id === id ? { ...r, icon: emojiData.emoji } : r));
    }
    setEmojiPickerTarget(null);
  };

  const toggleStar = (taskId, day) => {
    const currentWeekData = weeklyMatrix[selectedWeek] || {};
    const taskData = currentWeekData[taskId] || {};
    const isChecked = !!taskData[day];
    const updatedWeekData = { ...currentWeekData, [taskId]: { ...taskData, [day]: !isChecked } };
    
    setWeeklyMatrix({ ...weeklyMatrix, [selectedWeek]: updatedWeekData });
    setTotalStars(prev => isChecked ? Math.max(0, prev - 1) : prev + 1);
  };

  const starsEarnedInSelectedWeek = useMemo(() => {
    const weekData = weeklyMatrix[selectedWeek] || {};
    let count = 0;
    Object.values(weekData).forEach(taskDays => Object.values(taskDays).forEach(v => v && count++));
    return count;
  }, [weeklyMatrix, selectedWeek]);

  const handleApplyBonus = (isPositive) => {
    if (!bonusReason.trim()) return alert('Vui lòng nhập lý do thưởng/phạt!');
    const points = Math.abs(parseInt(bonusPoints) || 1);
    const actualPoints = isPositive ? points : -points;

    if (!isPositive && totalStars < points) return alert('Bé không đủ sao để trừ!');
    
    setTotalStars(prev => Math.max(0, prev + actualPoints));
    setBonusHistory([{
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      points: actualPoints,
      reason: bonusReason.trim(),
      week: selectedWeek
    }, ...bonusHistory]);
    setBonusReason('');
  };

  const handleRedeem = (reward) => {
    if (totalStars < reward.cost) return alert('Bé chưa đủ sao để đổi quà này rồi, cố gắng thêm nhé!');
    if (window.confirm(`Xác nhận đổi "${reward.name}" với ${reward.cost} ⭐?`)) {
      setTotalStars(prev => prev - reward.cost);
      setRedeemHistory([{
        id: 'rd_' + Date.now(),
        rewardName: reward.name,
        rewardIcon: reward.icon,
        cost: reward.cost,
        date: new Date().toLocaleDateString('vi-VN'),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed' 
      }, ...redeemHistory]);
    }
  };

  const handleCancelRedeem = (logId) => {
    const item = redeemHistory.find(r => r.id === logId);
    if (!item || item.status === 'cancelled') return;
    if (window.confirm(`Hủy đổi quà "${item.rewardName}" và hoàn lại ${item.cost} ⭐ cho bé?`)) {
      setTotalStars(prev => prev + item.cost);
      setRedeemHistory(redeemHistory.map(r => r.id === logId ? {
        ...r, status: 'cancelled',
        cancelTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN')
      } : r));
    }
  };

  const handlePrint = () => window.print();

  const classLeaderboard = useMemo(() => {
    const mockList = [
      { name: 'Minh Trí', avatar: '🦁', stars: 28 },
      { name: 'Khánh Mai', avatar: '🦄', stars: 24 },
      { name: 'Bảo An', avatar: '🐱', stars: 21 },
      { name: childName, avatar: childAvatar, stars: starsEarnedInSelectedWeek, isSelf: true },
      { name: 'Đức Anh', avatar: '🚀', stars: 16 },
      { name: 'Gia Hân', avatar: '👑', stars: 12 },
    ];
    return mockList.sort((a, b) => b.stars - a.stars);
  }, [childName, childAvatar, starsEarnedInSelectedWeek]);

  // === RENDER MÀN HÌNH ĐĂNG NHẬP ===
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-sky-100 to-indigo-100 text-slate-800'}`}>
        <div className={`w-full max-full max-w-md p-8 rounded-3xl shadow-xl transition-all ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-sky-100 mb-3 text-4xl shadow-inner">⭐</div>
            <h1 className="text-3xl font-extrabold text-sky-600">Bé Ngoan 1B</h1>
            <p className="text-sm opacity-75 mt-1">Cùng con rèn luyện thói quen tốt mỗi ngày</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tên đăng nhập (Username)</label>
              <input
                type="text" required value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="VD: nhoc_bin"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 p-1">
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <p className="text-xs text-sky-500 font-medium mt-1">💡 Mật khẩu cần tối thiểu 6 ký tự</p>
            </div>

            {authError && <div className="p-3 text-sm bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-center font-medium animate-bounce">⚠ {authError}</div>}

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
              {authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản Mới'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-sky-600 dark:text-sky-400 hover:underline font-bold">
              {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === MÀN HÌNH CHÍNH ===
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-24 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-sky-50 text-slate-800'}`}>
      
      {/* MODAL BẢNG CHỌN EMOJI */}
      {emojiPickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`p-4 rounded-3xl shadow-2xl relative w-full max-w-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Chọn Biểu Tượng</h3>
              <button onClick={() => setEmojiPickerTarget(null)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">✕</button>
            </div>
            <div className="h-[400px] overflow-hidden rounded-xl border dark:border-slate-700">
               <EmojiPicker 
                 onEmojiClick={handleEmojiSelect} 
                 width="100%" height="100%"
                 theme={darkMode ? 'dark' : 'light'}
                 searchPlaceHolder="Tìm kiếm Emoji..."
               />
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-sky-100 shadow-sm'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AvatarDisplay avatar={childAvatar} className="w-11 h-11 text-3xl bg-sky-100 dark:bg-slate-700 rounded-2xl shadow-sm" />
            <div>
              <h1 className="font-extrabold text-lg flex items-center gap-1.5">
                {childName}
                <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 font-bold rounded-full">Lớp 1B</span>
              </h1>
              <p className="text-xs opacity-75">Cùng con tích sao đổi quà</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-sky-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-400 text-amber-950 font-black rounded-2xl shadow-md">
              <IconStar className="w-6 h-6 text-amber-950" />
              <span className="text-lg">{totalStars}</span>
            </div>
            <button onClick={handlePrint} className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs flex items-center gap-1 shadow-md transition-all print:hidden">
              <IconPrinter className="w-4 h-4" />
              <span className="hidden sm:inline">In/PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">

        {/* TAB 1: BẢNG NHIỆM VỤ */}
        {currentTab === 'tasks' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📅</span>
                <div>
                  <h2 className="font-bold text-base">Đang xem: <span className="text-sky-500 font-extrabold">{selectedWeek}</span></h2>
                  <p className="text-xs opacity-75">Tích lũy tuần này: <b>{starsEarnedInSelectedWeek}</b> / {weeklyGoal} ⭐</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => { const [y, w] = selectedWeek.split('-W'); const wNum = parseInt(w) - 1; setSelectedWeek(`${y}-W${wNum < 10 ? '0'+wNum : wNum}`); }} className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-slate-100 dark:bg-slate-700 dark:border-slate-600 hover:bg-slate-200">◄ Tuần trước</button>
                {selectedWeek !== currentRealWeek && (
                  <button onClick={() => setSelectedWeek(currentRealWeek)} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-500 text-white shadow-sm">Tuần hiện tại</button>
                )}
                <button onClick={() => { const [y, w] = selectedWeek.split('-W'); const wNum = parseInt(w) + 1; setSelectedWeek(`${y}-W${wNum < 10 ? '0'+wNum : wNum}`); }} className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-slate-100 dark:bg-slate-700 dark:border-slate-600 hover:bg-slate-200">Tuần sau ►</button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span>🎯 Tiến độ mục tiêu tuần này</span>
                <span>{Math.round((starsEarnedInSelectedWeek / weeklyGoal) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (starsEarnedInSelectedWeek / weeklyGoal) * 100)}%` }} />
              </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-xs uppercase border-b ${darkMode ? 'bg-slate-700/50 border-slate-700 text-slate-300' : 'bg-sky-50/70 border-sky-100 text-slate-600'}`}>
                      <th className="p-3.5 sticky left-0 z-10 bg-inherit min-w-[160px]">Nhiệm vụ</th>
                      {daysOfWeek.map(day => <th key={day} className="p-3.5 text-center min-w-[48px]">{day}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                    {tasks.map(task => {
                      const weekData = weeklyMatrix[selectedWeek] || {};
                      const taskDays = weekData[task.id] || {};
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                          <td className={`p-3.5 font-medium sticky left-0 z-10 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{task.icon}</span>
                              <span className="line-clamp-2">{task.name}</span>
                            </div>
                          </td>
                          {daysOfWeek.map(day => {
                            const isChecked = !!taskDays[day];
                            return (
                              <td key={day} className="p-2 text-center">
                                <button onClick={() => toggleStar(task.id, day)} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isChecked ? 'bg-yellow-400 text-white shadow-md shadow-yellow-400/30 scale-105' : 'bg-slate-100 dark:bg-slate-700 text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-600'}`}>
                                  <IconStar className={isChecked ? 'text-amber-950 w-6 h-6' : 'text-slate-300 dark:text-slate-500 w-5 h-5'} />
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h3 className="font-bold text-sm flex items-center gap-1.5">⚡ Thưởng / Phạt điểm ngoại lệ</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="Lý do (VD: Giúp mẹ lau nhà...)" value={bonusReason} onChange={(e) => setBonusReason(e.target.value)} className={`flex-1 px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`} />
                <div className="flex items-center space-x-2">
                  <input type="number" min="1" max="50" value={bonusPoints} onChange={(e) => setBonusPoints(e.target.value)} className={`w-16 px-2 py-2 text-sm text-center font-bold rounded-xl border text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`} />
                  <button onClick={() => handleApplyBonus(true)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-all">+ Thưởng</button>
                  <button onClick={() => handleApplyBonus(false)} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl shadow-md transition-all">- Phạt</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ĐỔI QUÀ */}
        {currentTab === 'rewards' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold mb-3">🎁 Danh Sách Phần Thưởng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rewards.map(reward => {
                  const canRedeem = totalStars >= reward.cost;
                  return (
                    <div key={reward.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl p-2 bg-sky-50 dark:bg-slate-700 rounded-2xl">{reward.icon}</div>
                        <div>
                          <h3 className="font-bold text-sm">{reward.name}</h3>
                          <p className="text-xs text-sky-600 font-bold flex items-center gap-1 mt-0.5"><IconStar className="w-4 h-4 text-yellow-400" /> {reward.cost} Sao</p>
                        </div>
                      </div>
                      <button onClick={() => handleRedeem(reward)} disabled={!canRedeem} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${canRedeem ? 'bg-sky-500 hover:bg-sky-600 text-white scale-105 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}>
                        {canRedeem ? 'Đổi quà' : 'Thếu sao'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">📜 Lịch sử đổi quà</h3>
              {redeemHistory.length === 0 ? (
                <p className="text-xs opacity-60 text-center py-4">Bé chưa đổi phần thưởng nào.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {redeemHistory.map(item => (
                    <div key={item.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${item.status === 'cancelled' ? 'opacity-50 line-through bg-slate-100 dark:bg-slate-700/40' : 'bg-slate-50 dark:bg-slate-700/60'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.rewardIcon}</span>
                        <div>
                          <p className="font-bold">{item.rewardName} (-{item.cost} ⭐)</p>
                          <p className="text-[10px] opacity-75">{item.time} - {item.date}</p>
                          {item.status === 'cancelled' && <p className="text-[10px] text-rose-500 font-medium no-underline">Đã hủy: {item.cancelTime}</p>}
                        </div>
                      </div>
                      {item.status !== 'cancelled' && (
                        <button onClick={() => handleCancelRedeem(item.id)} className="px-2.5 py-1 text-[11px] bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg font-bold">Hủy đổi</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: BẢNG VÀNG LỚP 1B */}
        {currentTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 rounded-3xl shadow-lg relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-8xl opacity-20">🏆</span>
              <h2 className="text-2xl font-black uppercase tracking-wide">🏆 BẢNG VÀNG LỚP 1B</h2>
              <p className="text-xs font-semibold opacity-90 mt-1">Thi đua tích sao - Nhận quà cùng các bạn!</p>
              <div className="inline-flex items-center space-x-2 mt-4 px-3 py-1 bg-white/40 backdrop-blur-md rounded-xl text-xs font-bold">
                <span>Xem tuần:</span>
                <select value={leaderboardWeek} onChange={(e) => setLeaderboardWeek(e.target.value)} className="bg-transparent font-black focus:outline-none cursor-pointer text-slate-900">
                  <option value={currentRealWeek}>Tuần này ({currentRealWeek})</option>
                  <option value="2026-W39">Tuần trước (2026-W39)</option>
                </select>
              </div>
            </div>

            <div className={`p-4 rounded-3xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              {classLeaderboard.map((item, index) => {
                const rankColors = [
                  'bg-yellow-100 text-yellow-700 border-yellow-300 font-extrabold text-base',
                  'bg-slate-100 text-slate-700 border-slate-300 font-bold',
                  'bg-orange-50 text-orange-800 border-orange-200 font-bold',
                ];
                return (
                  <div key={index} className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${item.isSelf ? 'ring-2 ring-sky-400 bg-sky-50/50 dark:bg-slate-700/80' : 'bg-slate-50/50 dark:bg-slate-700/30'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${rankColors[index] || 'bg-slate-50 text-slate-500 border-slate-200 text-xs'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>
                      <AvatarDisplay avatar={item.avatar} className="w-8 h-8 text-2xl" />
                      <div>
                        <h4 className="font-bold text-sm flex items-center gap-1.5">
                          {item.name}
                          {item.isSelf && <span className="text-[10px] bg-sky-500 text-white px-2 py-0.2 rounded-full font-bold">Bé nhà bạn</span>}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 font-black text-yellow-500">
                      <span>{item.stars}</span>
                      <IconStar className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: THỐNG KÊ */}
        {currentTab === 'stats' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h2 className="font-extrabold text-base mb-3">📊 Lịch Sử Thưởng Phạt Đột Xuất</h2>
              <div className="space-y-2">
                {bonusHistory.length === 0 ? (
                  <p className="text-xs opacity-60 text-center py-6">Chưa có lịch sử thưởng / phạt ngoại lệ nào.</p>
                ) : (
                  bonusHistory.map(log => (
                    <div key={log.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${log.points > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300'}`}>
                      <div>
                        <p className="font-bold">{log.reason}</p>
                        <p className="text-[10px] opacity-75">{log.time} - {log.date} ({log.week})</p>
                      </div>
                      <span className="font-black text-sm">{log.points > 0 ? `+${log.points}` : log.points} ⭐</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CÀI ĐẶT */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            
            {/* THÔNG TIN BÉ & AVATAR */}
            <div className={`p-4 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 dark:border-slate-700">👤 Thông tin & Avatar của bé</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tên của bé</label>
                  <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl border text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2">Chọn Avatar nhanh hoặc tải ảnh lên</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Nút Upload File Thực Tế */}
                    <label className="cursor-pointer px-4 py-2 bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 font-bold rounded-xl text-sm hover:bg-sky-200 transition-colors shadow-sm border border-sky-200 dark:border-sky-700">
                      📸 Tải Ảnh Lên
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>

                    <div className="h-6 w-[1px] bg-slate-300 dark:bg-slate-600 mx-1"></div>

                    {AVATAR_OPTIONS.map(emoji => (
                      <button key={emoji} type="button" onClick={() => setChildAvatar(emoji)} className={`text-2xl p-1.5 rounded-xl transition-all ${childAvatar === emoji ? 'bg-sky-400 scale-110 shadow-md' : 'bg-slate-100 dark:bg-slate-700 hover:bg-sky-100'}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Mục tiêu sao mỗi tuần</label>
                  <input type="number" value={weeklyGoal} onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 10)} className={`w-28 px-3 py-2 text-sm rounded-xl border font-bold text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`} />
                </div>
              </div>
            </div>

            {/* QUẢN LÝ NHIỆM VỤ */}
            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 dark:border-slate-700">📋 Danh sách nhiệm vụ</h3>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <button onClick={() => setEmojiPickerTarget({ type: 'task', id: task.id })} className="w-12 px-2 py-1.5 text-center text-lg rounded-xl border bg-slate-100 hover:bg-sky-100 dark:bg-slate-700 transition-colors cursor-pointer" title="Bấm để đổi Icon">
                      {task.icon}
                    </button>
                    <input type="text" value={task.name} onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, name: e.target.value } : t))} className={`flex-1 px-3 py-2 text-sm rounded-xl border focus:bg-white text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`} />
                    <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="px-2.5 py-1.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl font-bold">Xóa</button>
                  </div>
                ))}
                <button onClick={() => setTasks([...tasks, { id: 't_' + Date.now(), name: 'Nhiệm vụ mới', icon: '🌟' }])} className="w-full py-2.5 bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-dashed border-sky-300 transition-colors">
                  + Thêm nhiệm vụ mới
                </button>
              </div>
            </div>

            {/* QUẢN LÝ PHẦN THƯỞNG */}
            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-100 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 dark:border-slate-700">🎁 Cài đặt phần thưởng</h3>
              <div className="space-y-2">
                {rewards.map(reward => (
                  <div key={reward.id} className="flex items-center space-x-2">
                    <button onClick={() => setEmojiPickerTarget({ type: 'reward', id: reward.id })} className="w-12 px-2 py-1.5 text-center text-lg rounded-xl border bg-slate-100 hover:bg-sky-100 dark:bg-slate-700 transition-colors cursor-pointer" title="Bấm để đổi Icon">
                      {reward.icon}
                    </button>
                    <input type="text" value={reward.name} onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? { ...r, name: e.target.value } : r))} className={`flex-1 px-3 py-2 text-sm rounded-xl border focus:bg-white text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`} placeholder="Tên quà..." />
                    <div className="relative w-20">
                      <input type="number" value={reward.cost} onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? { ...r, cost: parseInt(e.target.value)||0 } : r))} className={`w-full px-2 py-2 pr-6 text-sm font-bold text-right rounded-xl border text-slate-900 dark:text-white ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'}`} />
                      <IconStar className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
                    </div>
                    <button onClick={() => setRewards(rewards.filter(r => r.id !== reward.id))} className="px-2.5 py-1.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl font-bold">Xóa</button>
                  </div>
                ))}
                <button onClick={() => setRewards([...rewards, { id: 'r_' + Date.now(), name: 'Phần thưởng mới', icon: '🎁', cost: 10 }])} className="w-full py-2.5 bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold text-xs rounded-xl border border-dashed border-sky-300 transition-colors">
                  + Thêm phần thưởng mới
                </button>
              </div>
            </div>

            {/* ĐĂNG XUẤT */}
            <div className="pt-2">
              <button onClick={handleLogout} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all">
                Đăng Xuất ({user.username})
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER NAV */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 px-3 py-2 border-t backdrop-blur-lg transition-colors print:hidden ${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-sky-100'}`}>
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'tasks', label: 'Nhiệm Vụ', icon: '🗓️' },
            { id: 'rewards', label: 'Đổi Quà', icon: '🎁' },
            { id: 'leaderboard', label: 'Bảng Vàng', icon: '🏆' },
            { id: 'stats', label: 'Thống Kê', icon: '📊' },
            { id: 'settings', label: 'Cài Đặt', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
                currentTab === tab.id
                  ? 'bg-sky-500 text-white font-black scale-105 shadow-md shadow-sky-500/30'
                  : 'text-slate-500 hover:text-sky-500'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}