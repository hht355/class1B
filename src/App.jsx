import React, { useState, useEffect, useMemo, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';

// === FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyDVlG4hRwmUbvQ8Rk1QIo4co5zN8jzooGQ",
  authDomain: "dashboard-class-1b.firebaseapp.com",
  projectId: "dashboard-class-1b",
  storageBucket: "dashboard-class-1b.firebasestorage.app",
  messagingSenderId: "803151730368",
  appId: "1:803151730368:web:1e3d3c7d19480923b73f25",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// === INLINE SVG ICONS ===
const IconStar = ({ className = "w-5 h-5 text-amber-400" }) => (
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

const getWeekId = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo < 10 ? '0' + weekNo : weekNo}`;
};

const DEFAULT_TASKS = [
  { id: 't1', name: 'Đánh răng sáng tối', icon: '🪥' },
  { id: 't2', name: 'Dọn dẹp đồ chơi', icon: '🧸' },
  { id: 't3', name: 'Ăn hết phần cơm', icon: '🍚' },
  { id: 't4', name: 'Làm bài tập', icon: '✏️' },
  { id: 't5', name: 'Chào hỏi lễ phép', icon: '🙇‍♂️' },
];

const DEFAULT_REWARDS = [
  { id: 'r1', name: 'Xem hoạt hình 15 phút', icon: '📺', cost: 5 },
  { id: 'r2', name: 'Đi nhà sách mua truyện', icon: '📚', cost: 15 },
  { id: 'r3', name: 'Đi chơi công viên', icon: '🎡', cost: 20 },
  { id: 'r4', name: 'Mua đồ chơi nhỏ', icon: '🚗', cost: 30 },
];

// Đọc dữ liệu cũ đang lưu trong localStorage (để chuyển lên cloud một lần)
const readLocalLegacy = () => {
  try {
    if (!localStorage.getItem('kt_weekly_matrix') && !localStorage.getItem('kt_tasks')) return null;
    const j = (k, fallback) => {
      try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
    };
    const avatar = localStorage.getItem('kt_child_avatar') || '👦';
    return {
      childName: localStorage.getItem('kt_child_name') || 'Bé Ngoan',
      childAvatar: avatar.length > 300000 ? '👦' : avatar,
      totalStars: parseInt(localStorage.getItem('kt_total_stars') || '0') || 0,
      weeklyGoal: parseInt(localStorage.getItem('kt_weekly_goal') || '20') || 20,
      tasks: j('kt_tasks', DEFAULT_TASKS),
      rewards: j('kt_rewards', DEFAULT_REWARDS),
      weeklyMatrix: j('kt_weekly_matrix', {}),
      bonusHistory: j('kt_bonus_history', []),
      redeemHistory: j('kt_redeem_history', []),
    };
  } catch {
    return null;
  }
};

const authErrorMessage = (code) => ({
  'auth/invalid-email': 'Email không hợp lệ!',
  'auth/missing-email': 'Vui lòng nhập email!',
  'auth/email-already-in-use': 'Email này đã được đăng ký, hãy đăng nhập!',
  'auth/weak-password': 'Mật khẩu quá yếu, cần ít nhất 6 ký tự!',
  'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác!',
  'auth/user-not-found': 'Email hoặc mật khẩu không chính xác!',
  'auth/wrong-password': 'Email hoặc mật khẩu không chính xác!',
  'auth/too-many-requests': 'Thử quá nhiều lần, vui lòng đợi một lát rồi thử lại!',
  'auth/network-request-failed': 'Mất kết nối mạng, vui lòng thử lại!',
  'auth/popup-blocked': 'Trình duyệt đang chặn cửa sổ đăng nhập Google!',
  'auth/unauthorized-domain': 'Tên miền này chưa được cho phép trong Firebase (Authentication > Settings > Authorized domains).',
}[code] || 'Có lỗi xảy ra, vui lòng thử lại!');

// Lấy ngày Thứ Năm của một tuần ISO (VD "2026-W40") để suy ra tháng
const weekIdToThursday = (weekId) => {
  const [y, w] = weekId.split('-W').map(Number);
  const jan4 = new Date(y, 0, 4);
  const monday1 = new Date(jan4);
  monday1.setDate(jan4.getDate() - ((jan4.getDay() || 7) - 1));
  const thursday = new Date(monday1);
  thursday.setDate(monday1.getDate() + (w - 1) * 7 + 3);
  return thursday;
};

// === BIỂU ĐỒ ĐƯỜNG (SVG thuần, hỗ trợ light/dark) ===
const LineChart = ({ data, goal }) => {
  const W = 600, H = 250, padL = 38, padR = 24, padT = 30, padB = 38;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(4, goal || 0, ...data.map(d => d.stars));
  const minVal = Math.min(0, ...data.map(d => d.stars));
  const yMax = Math.ceil(maxVal / 4) * 4;
  const yMin = Math.floor(minVal / 4) * 4;
  const xAt = (i) => (data.length === 1 ? padL + innerW / 2 : padL + (innerW * i) / (data.length - 1));
  const yAt = (v) => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const points = data.map((d, i) => ({ ...d, x: xAt(i), y: yAt(d.stars) }));
  const linePath = points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${yAt(0)} L${points[0].x},${yAt(0)} Z`;
  const ticks = [0, 1, 2, 3, 4].map(i => yMin + ((yMax - yMin) * i) / 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Biểu đồ đường số sao theo thời gian">
      <defs>
        <linearGradient id="ktAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Lưới ngang + nhãn trục Y */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={yAt(t)} y2={yAt(t)} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
          <text x={padL - 8} y={yAt(t) + 4} textAnchor="end" fontSize="11" className="fill-slate-500 dark:fill-slate-400">{t}</text>
        </g>
      ))}

      {/* Đường mục tiêu (chỉ có ở chế độ tuần) */}
      {goal ? (
        <g>
          <line x1={padL} x2={W - padR} y1={yAt(goal)} y2={yAt(goal)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x={W - padR} y={yAt(goal) - 5} textAnchor="end" fontSize="11" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Mục tiêu {goal}</text>
        </g>
      ) : null}

      {/* Vùng tô + đường */}
      {points.length > 1 && <path d={areaPath} fill="url(#ktAreaGrad)" />}
      {points.length > 1 && (
        <path d={linePath} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Điểm + giá trị + nhãn trục X */}
      {points.map((p, i) => {
        const showLabel = data.length <= 8 || i % 2 === (data.length - 1) % 2;
        return (
          <g key={p.key}>
            <circle cx={p.x} cy={p.y} r="5" fill="#0ea5e9" className="stroke-white dark:stroke-slate-800" strokeWidth="2" />
            <text x={p.x} y={p.y - 11} textAnchor="middle" fontSize="12" fontWeight="800" className="fill-slate-800 dark:fill-slate-100">{p.stars}</text>
            {showLabel && (
              <text x={p.x} y={H - 14} textAnchor="middle" fontSize="11" className="fill-slate-600 dark:fill-slate-300">{p.label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default function KidTracker() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('kt_dark') === 'true');
  const [currentTab, setCurrentTab] = useState('tasks');

  const [childName, setChildName] = useState('Bé Ngoan');
  const [childAvatar, setChildAvatar] = useState('👦');
  const [totalStars, setTotalStars] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(20);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);

  const currentRealWeek = getWeekId();
  const [selectedWeek, setSelectedWeek] = useState(currentRealWeek);
  const [weeklyMatrix, setWeeklyMatrix] = useState({});
  const [bonusHistory, setBonusHistory] = useState([]);
  const [redeemHistory, setRedeemHistory] = useState([]);

  const [bonusPoints, setBonusPoints] = useState(1);
  const [bonusReason, setBonusReason] = useState('');
  const [leaderboardWeek, setLeaderboardWeek] = useState(currentRealWeek);

  const [pickerTarget, setPickerTarget] = useState(null);
  const [statsView, setStatsView] = useState('week');
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [joinLeaderboard, setJoinLeaderboard] = useState(true);
  const syncedRef = useRef({});

  useEffect(() => {
    localStorage.setItem('kt_dark', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const applyData = (d) => {
    const data = d || {};
    setChildName(data.childName ?? 'Bé Ngoan');
    setChildAvatar(data.childAvatar ?? '👦');
    setTotalStars(data.totalStars ?? 0);
    setWeeklyGoal(data.weeklyGoal ?? 20);
    setTasks(data.tasks ?? DEFAULT_TASKS);
    setRewards(data.rewards ?? DEFAULT_REWARDS);
    setWeeklyMatrix(data.weeklyMatrix ?? {});
    setBonusHistory(data.bonusHistory ?? []);
    setRedeemHistory(data.redeemHistory ?? []);
    setJoinLeaderboard(data.joinLeaderboard ?? true);
  };

  // Theo dõi đăng nhập + tải dữ liệu từ Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      syncedRef.current = {};
      if (!fbUser) {
        setUser(null);
        setDataLoaded(false);
        applyData(null);
        setSyncError('');
        setAuthLoading(false);
        return;
      }
      setAuthLoading(true);
      const info = { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName };
      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        if (snap.exists()) {
          applyData(snap.data());
        } else {
          const legacy = readLocalLegacy();
          if (legacy && window.confirm('Tìm thấy dữ liệu cũ lưu trên máy này. Chuyển lên tài khoản mới để không mất sao đã tích?')) {
            applyData(legacy);
          } else {
            applyData({ childName: fbUser.displayName || (fbUser.email || '').split('@')[0] || 'Bé Ngoan' });
          }
        }
        setUser(info);
        setDataLoaded(true);
        setSyncError('');
      } catch (err) {
        console.error(err);
        setUser(info);
        setDataLoaded(false);
        setSyncError('Không tải được dữ liệu từ Firebase. Hãy kiểm tra đã tạo Firestore và đặt quy tắc bảo mật chưa.');
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Lưu dữ liệu của bé lên Firestore (đợi 0,8 giây sau thay đổi cuối)
  useEffect(() => {
    if (!user || !dataLoaded) return;
    const t = setTimeout(() => {
      setDoc(doc(db, 'users', user.uid), {
        childName, childAvatar, totalStars, weeklyGoal, joinLeaderboard,
        tasks, rewards, weeklyMatrix, bonusHistory, redeemHistory,
        updatedAt: serverTimestamp(),
      })
        .then(() => setSyncError(''))
        .catch((err) => {
          console.error(err);
          setSyncError('Không lưu được dữ liệu lên Firebase. Kiểm tra mạng hoặc quy tắc bảo mật.');
        });
    }, 800);
    return () => clearTimeout(t);
  }, [user?.uid, dataLoaded, childName, childAvatar, totalStars, weeklyGoal, joinLeaderboard, tasks, rewards, weeklyMatrix, bonusHistory, redeemHistory]);

  // Đẩy điểm từng tuần của bé lên bảng vàng chung của lớp
  useEffect(() => {
    if (!user || !dataLoaded) return;
    const t = setTimeout(() => {
      const weekly = {};
      Object.entries(weeklyMatrix).forEach(([wk, wData]) => {
        let c = 0;
        Object.values(wData).forEach(days => Object.values(days).forEach(v => { if (v) c++; }));
        weekly[wk] = c;
      });
      bonusHistory.forEach(l => { if (l.week) weekly[l.week] = (weekly[l.week] || 0) + l.points; });
      if (weekly[currentRealWeek] === undefined) weekly[currentRealWeek] = 0;
      const lbAvatar = (childAvatar.startsWith('data:') || childAvatar.startsWith('http')) ? '🙂' : childAvatar;

      // Tắt tham gia: xóa thông tin của bé khỏi bảng vàng chung
      if (!joinLeaderboard) {
        Object.keys(weekly).forEach((wk) => {
          if (syncedRef.current[wk] === 'off') return;
          syncedRef.current[wk] = 'off';
          deleteDoc(doc(db, 'weeklyScores', wk, 'entries', user.uid)).catch((err) => {
            console.error(err);
            delete syncedRef.current[wk];
          });
        });
        return;
      }
      Object.entries(weekly).forEach(([wk, stars]) => {
        const sig = `${stars}|${childName}|${lbAvatar}`;
        if (syncedRef.current[wk] === sig) return;
        syncedRef.current[wk] = sig;
        setDoc(doc(db, 'weeklyScores', wk, 'entries', user.uid), {
          name: childName, avatar: lbAvatar, stars, updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.error(err);
          delete syncedRef.current[wk];
        });
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [user?.uid, dataLoaded, joinLeaderboard, weeklyMatrix, bonusHistory, childName, childAvatar, currentRealWeek]);

  // Nghe bảng vàng của tuần đang chọn (chỉ khi mở tab Bảng vàng)
  useEffect(() => {
    if (!user || currentTab !== 'leaderboard' || !joinLeaderboard) return;
    const unsub = onSnapshot(
      collection(db, 'weeklyScores', leaderboardWeek, 'entries'),
      (snap) => setLeaderboardEntries(snap.docs.map(d => ({ uid: d.id, ...d.data() }))),
      (err) => console.error(err)
    );
    return () => unsub();
  }, [user?.uid, currentTab, leaderboardWeek, joinLeaderboard]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const email = emailInput.trim();
    if (!email) {
      setAuthError('Vui lòng nhập email!');
      return;
    }
    if (passwordInput.length < 6) {
      setAuthError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    try {
      if (authMode === 'register') await createUserWithEmailAndPassword(auth, email, passwordInput);
      else await signInWithEmailAndPassword(auth, email, passwordInput);
    } catch (err) {
      setAuthError(authErrorMessage(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setAuthError(authErrorMessage(err.code));
      }
    }
  };

  const handleResetPassword = async () => {
    setAuthError('');
    const email = emailInput.trim();
    if (!email) {
      setAuthError('Nhập email vào ô trên rồi bấm "Quên mật khẩu" nhé!');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Đã gửi email đặt lại mật khẩu. Hãy kiểm tra hộp thư (cả mục Spam).');
    } catch (err) {
      setAuthError(authErrorMessage(err.code));
    }
  };

  const handleLogout = () => signOut(auth);

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const toggleStar = (taskId, day) => {
    const currentWeekData = weeklyMatrix[selectedWeek] || {};
    const taskData = currentWeekData[taskId] || {};
    const isChecked = !!taskData[day];
    const updatedTaskData = { ...taskData, [day]: !isChecked };
    const updatedWeekData = { ...currentWeekData, [taskId]: updatedTaskData };
    
    setWeeklyMatrix({ ...weeklyMatrix, [selectedWeek]: updatedWeekData });
    if (!isChecked) setTotalStars(prev => prev + 1);
    else setTotalStars(prev => Math.max(0, prev - 1));
  };

  const starsEarnedInSelectedWeek = useMemo(() => {
    const weekData = weeklyMatrix[selectedWeek] || {};
    let count = 0;
    Object.values(weekData).forEach(taskDays => {
      Object.values(taskDays).forEach(val => { if (val) count++; });
    });
    // Cộng/trừ điểm thưởng phạt đột xuất của tuần đang xem
    bonusHistory.forEach(log => {
      if (log.week === selectedWeek) count += log.points;
    });
    return count;
  }, [weeklyMatrix, bonusHistory, selectedWeek]);

  const handleApplyBonus = (isPositive) => {
    if (!bonusReason.trim()) {
      alert('Vui lòng nhập lý do thưởng/phạt!');
      return;
    }
    const points = Math.abs(parseInt(bonusPoints) || 1);
    const actualPoints = isPositive ? points : -points;
    if (!isPositive && totalStars < points) {
      alert('Bé không đủ sao để trừ!');
      return;
    }
    setTotalStars(prev => Math.max(0, prev + actualPoints));
    const newLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      points: actualPoints,
      reason: bonusReason.trim(),
      week: selectedWeek
    };
    setBonusHistory([newLog, ...bonusHistory]);
    setBonusReason('');
  };

  const handleRedeem = (reward) => {
    if (totalStars < reward.cost) {
      alert('Bé chưa đủ sao để đổi quà này rồi, cố gắng thêm nhé!');
      return;
    }
    if (window.confirm(`Xác nhận đổi "${reward.name}" với ${reward.cost} ⭐?`)) {
      setTotalStars(prev => prev - reward.cost);
      const redeemLog = {
        id: 'rd_' + Date.now(),
        rewardName: reward.name,
        rewardIcon: reward.icon,
        cost: reward.cost,
        date: new Date().toLocaleDateString('vi-VN'),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed'
      };
      setRedeemHistory([redeemLog, ...redeemHistory]);
    }
  };

  const handleCancelRedeem = (logId) => {
    const item = redeemHistory.find(r => r.id === logId);
    if (!item || item.status === 'cancelled') return;
    if (window.confirm(`Hủy đổi quà "${item.rewardName}" và hoàn lại ${item.cost} ⭐ cho bé?`)) {
      setTotalStars(prev => prev + item.cost);
      setRedeemHistory(redeemHistory.map(r => r.id === logId ? {
        ...r,
        status: 'cancelled',
        cancelTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN')
      } : r));
    }
  };

  // Thu nhỏ ảnh về 128x128 để lưu gọn trên Firestore
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const min = Math.min(img.width, img.height);
        canvas.getContext('2d').drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
        setChildAvatar(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleEmojiSelect = (emojiData) => {
    if (pickerTarget === 'avatar') {
      setChildAvatar(emojiData.emoji);
    } else if (pickerTarget?.type === 'task') {
      setTasks(tasks.map(t => t.id === pickerTarget.id ? { ...t, icon: emojiData.emoji } : t));
    } else if (pickerTarget?.type === 'reward') {
      setRewards(rewards.map(r => r.id === pickerTarget.id ? { ...r, icon: emojiData.emoji } : r));
    }
    setPickerTarget(null);
  };

  const leaderboardStars = useMemo(() => {
    const weekData = weeklyMatrix[leaderboardWeek] || {};
    let count = 0;
    Object.values(weekData).forEach(taskDays => {
      Object.values(taskDays).forEach(val => { if (val) count++; });
    });
    bonusHistory.forEach(log => {
      if (log.week === leaderboardWeek) count += log.points;
    });
    return count;
  }, [weeklyMatrix, bonusHistory, leaderboardWeek]);

  const leaderboardWeekOptions = useMemo(() => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 7);
    const prevWeek = getWeekId(prevDate);
    const all = new Set([
      currentRealWeek,
      prevWeek,
      ...Object.keys(weeklyMatrix),
      ...bonusHistory.map(l => l.week).filter(Boolean),
    ]);
    return Array.from(all).sort().reverse().map(w => ({
      id: w,
      label: w === currentRealWeek ? `Tuần này (${w})` : w === prevWeek ? `Tuần trước (${w})` : `Tuần ${w}`,
    }));
  }, [weeklyMatrix, bonusHistory, currentRealWeek]);

  const classLeaderboard = useMemo(() => {
    const list = leaderboardEntries.map(e => (
      e.uid === user?.uid
        ? { name: childName, avatar: childAvatar, stars: leaderboardStars, isSelf: true }
        : { name: e.name || 'Bạn nhỏ', avatar: e.avatar || '🙂', stars: e.stars ?? 0, isSelf: false }
    ));
    // Bé nhà mình luôn có mặt, kể cả khi chưa kịp đồng bộ
    if (user && !list.some(i => i.isSelf)) {
      list.push({ name: childName, avatar: childAvatar, stars: leaderboardStars, isSelf: true });
    }
    return list.sort((a, b) => b.stars - a.stars);
  }, [leaderboardEntries, user?.uid, childName, childAvatar, leaderboardStars]);

  const statsData = useMemo(() => {
    const counts = {};
    Object.keys(weeklyMatrix).forEach(wk => {
      let count = 0;
      Object.values(weeklyMatrix[wk]).forEach(taskDays => {
        Object.values(taskDays).forEach(v => { if (v) count++; });
      });
      counts[wk] = count;
    });
    // Cộng/trừ điểm thưởng phạt đột xuất vào đúng tuần đã ghi nhận
    bonusHistory.forEach(log => {
      if (log.week) counts[log.week] = (counts[log.week] || 0) + log.points;
    });
    const keys = Object.keys(counts).sort();
    if (keys.length === 0) return { weekly: [], monthly: [] };

    // Lấp các tuần trống bằng 0 để đường biểu đồ không bị "nhảy cóc"
    const lastKey = keys[keys.length - 1] > currentRealWeek ? keys[keys.length - 1] : currentRealWeek;
    const cursor = weekIdToThursday(keys[0]);
    const end = weekIdToThursday(lastKey);
    const fullWeeks = [];
    while (cursor <= end) {
      const id = getWeekId(cursor);
      fullWeeks.push({ key: id, label: id.split('-')[1], stars: counts[id] || 0 });
      cursor.setDate(cursor.getDate() + 7);
    }

    const monthMap = {};
    fullWeeks.forEach(w => {
      const t = weekIdToThursday(w.key);
      const mKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`;
      monthMap[mKey] = (monthMap[mKey] || 0) + w.stars;
    });
    const fullMonths = Object.keys(monthMap).sort().map(k => {
      const [y, m] = k.split('-');
      return { key: k, label: `T${parseInt(m)}/${y.slice(2)}`, stars: monthMap[k] };
    });

    return { weekly: fullWeeks.slice(-12), monthly: fullMonths.slice(-12) };
  }, [weeklyMatrix, bonusHistory, currentRealWeek]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold">
        ⭐ Đang tải dữ liệu...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-100 to-indigo-100 text-slate-800 dark:from-slate-900 dark:to-slate-900 dark:bg-slate-900 dark:text-white">
        <div className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-amber-100 mb-3 text-4xl shadow-inner">⭐</div>
            <h1 className="text-3xl font-extrabold text-amber-500">Class 1B</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Cùng con rèn luyện thói quen tốt mỗi ngày</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="VD: phuhuynh@gmail.com"
                className="w-full px-4 py-3 rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-200">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 p-1 text-slate-600 dark:text-slate-300"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">💡 Mật khẩu cần tối thiểu 6 ký tự</p>
            </div>

            {authError && (
              <div className="p-3 text-sm bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-center font-medium">
                ⚠ {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-sky-400/30 transition-all hover:scale-[1.02]"
            >
              {authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản Mới'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
            <span>hoặc</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border bg-white border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600 shadow-sm transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.2-3.9 7.2-9.6 7.2-16.9z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.2-8.8 2.2-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Đăng nhập bằng Google
          </button>

          <div className="mt-6 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
            >
              {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
            {authMode === 'login' && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="block mx-auto mt-3 text-xs text-slate-600 dark:text-slate-300 hover:underline"
              >
                Quên mật khẩu?
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-24 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-sky-50 text-slate-900'}`}>
      
      {/* HEADER TỔNG */}
      <header className={`sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-sky-100 shadow-sm'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-sky-100 dark:bg-slate-700 shadow-sm text-2xl border border-sky-200 dark:border-slate-600">
              {childAvatar.startsWith('data:') || childAvatar.startsWith('http') ? (
                <img src={childAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                childAvatar
              )}
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                {childName}
                <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 font-bold rounded-full">Lớp 1B</span>
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">Cùng con tích sao đổi quà</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-amber-400' : 'bg-sky-500 hover:bg-sky-600 border-sky-600 text-white'}`}
              title="Bật/Tắt chế độ tối"
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>

            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 font-black rounded-2xl shadow-md">
              <IconStar className="w-6 h-6 text-amber-950" />
              <span className="text-lg">{totalStars}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs flex items-center gap-1 shadow-md transition-all print:hidden"
            >
              <IconPrinter className="w-4 h-4" />
              <span className="hidden sm:inline">In/PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL CHỌN EMOJI */}
      {pickerTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl relative max-w-sm w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Chọn biểu tượng cảm xúc</h3>
              <button onClick={() => setPickerTarget(null)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-bold text-lg px-2">✕</button>
            </div>
            <EmojiPicker onEmojiClick={handleEmojiSelect} theme={darkMode ? 'dark' : 'light'} width="100%" height={350} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">

        {syncError && (
          <div className="p-3 text-sm bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-center font-medium">
            ⚠ {syncError}
          </div>
        )}

        {/* TAB 1: NHIỆM VỤ */}
        {currentTab === 'tasks' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📅</span>
                <div>
                  <h2 className="font-bold text-base text-slate-900 dark:text-white">Đang xem: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{selectedWeek}</span></h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Tích lũy tuần này: <b>{starsEarnedInSelectedWeek}</b> / {weeklyGoal} ⭐</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const [y, w] = selectedWeek.split('-W');
                    const wNum = parseInt(w) - 1;
                    setSelectedWeek(`${y}-W${wNum < 10 ? '0' + wNum : wNum}`);
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-sky-500 border-sky-600 text-white hover:bg-sky-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 shadow-sm"
                >
                  ◄ Tuần trước
                </button>

                {selectedWeek !== currentRealWeek && (
                  <button
                    onClick={() => setSelectedWeek(currentRealWeek)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                  >
                    Tuần hiện tại
                  </button>
                )}

                <button
                  onClick={() => {
                    const [y, w] = selectedWeek.split('-W');
                    const wNum = parseInt(w) + 1;
                    setSelectedWeek(`${y}-W${wNum < 10 ? '0' + wNum : wNum}`);
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border bg-sky-500 border-sky-600 text-white hover:bg-sky-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 shadow-sm"
                >
                  Tuần sau ►
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-slate-800 dark:text-slate-200">
                <span>🎯 Tiến độ mục tiêu tuần này</span>
                <span>{Math.max(0, Math.round((starsEarnedInSelectedWeek / weeklyGoal) * 100))}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, (starsEarnedInSelectedWeek / weeklyGoal) * 100))}%` }}
                />
              </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200'}`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`text-xs uppercase border-b ${darkMode ? 'bg-slate-700/50 border-slate-700 text-slate-300' : 'bg-sky-100/70 border-sky-200 text-slate-800'}`}>
                      <th className="p-3.5 text-left sticky left-0 z-10 bg-inherit min-w-[160px]">Nhiệm vụ</th>
                      {daysOfWeek.map(day => (
                        <th key={day} className="p-3.5 w-14 text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm">
                    {tasks.map(task => {
                      const weekData = weeklyMatrix[selectedWeek] || {};
                      const taskDays = weekData[task.id] || {};
                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                          <td className={`p-3.5 font-medium sticky left-0 z-10 ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{task.icon}</span>
                              <span className="line-clamp-2">{task.name}</span>
                            </div>
                          </td>
                          {daysOfWeek.map(day => {
                            const isChecked = !!taskDays[day];
                            return (
                              <td key={day} className="p-2 w-14 text-center align-middle">
                                <div className="flex justify-center items-center">
                                  <button
                                    onClick={() => toggleStar(task.id, day)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                      isChecked
                                        ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30 scale-105'
                                        : 'bg-sky-500 hover:bg-sky-600 border border-sky-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600'
                                    }`}
                                  >
                                    <IconStar className={isChecked ? 'text-amber-950 w-6 h-6' : 'text-sky-200 dark:text-slate-500 w-5 h-5'} />
                                  </button>
                                </div>
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

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">⚡ Thưởng / Phạt điểm ngoại lệ</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Lý do (VD: Giúp mẹ lau nhà...)"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bonusPoints}
                    onChange={(e) => setBonusPoints(e.target.value)}
                    className="w-16 px-2 py-2 text-sm text-center font-bold rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                  />
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
              <h2 className="text-lg font-extrabold mb-3 text-slate-900 dark:text-white">🎁 Danh Sách Phần Thưởng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rewards.map(reward => {
                  const canRedeem = totalStars >= reward.cost;
                  return (
                    <div key={reward.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl p-2 bg-amber-50 dark:bg-slate-700 rounded-2xl border border-amber-100 dark:border-slate-600">{reward.icon}</div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">{reward.name}</h3>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                            <IconStar className="w-4 h-4 text-amber-400" /> {reward.cost} Sao
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          canRedeem ? 'bg-sky-500 hover:bg-sky-600 text-white scale-105' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canRedeem ? 'Đổi quà' : 'Thiếu sao'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">📜 Lịch sử đổi quà</h3>
              {redeemHistory.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">Bé chưa đổi phần thưởng nào.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {redeemHistory.map(item => (
                    <div key={item.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${item.status === 'cancelled' ? 'opacity-50 line-through bg-slate-100 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 text-slate-600' : 'bg-sky-50/60 dark:bg-slate-700/60 border-sky-200 dark:border-slate-600 text-slate-900 dark:text-slate-200'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.rewardIcon}</span>
                        <div>
                          <p className="font-bold">{item.rewardName} (-{item.cost} ⭐)</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.time} - {item.date}</p>
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

        {/* TAB 3: BẢNG VÀNG */}
        {currentTab === 'leaderboard' && !joinLeaderboard && (
          <div className={`p-6 rounded-3xl border text-center space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
            <div className="text-5xl">🙈</div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Bạn đang không tham gia Bảng vàng</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Thông tin của bé đang được ẩn khỏi bảng xếp hạng lớp, và bé cũng không xem được bảng này. Bật lại để cùng thi đua với các bạn.
            </p>
            <button
              type="button"
              onClick={() => setJoinLeaderboard(true)}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Tham gia Bảng vàng
            </button>
          </div>
        )}

        {currentTab === 'leaderboard' && joinLeaderboard && (
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-500 text-white rounded-3xl shadow-lg relative overflow-hidden">
              <span className="absolute -right-4 -bottom-4 text-8xl opacity-20">🏆</span>
              <h2 className="text-2xl font-black uppercase tracking-wide">🏆 BẢNG VÀNG LỚP 1B</h2>
              <p className="text-xs font-semibold opacity-90 mt-1">Thi đua tích sao - Nhận quà cùng các bạn!</p>
              
              <div className="inline-flex items-center space-x-2 mt-4 px-3 py-1 bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white">
                <span>Xem tuần:</span>
                <select value={leaderboardWeek} onChange={(e) => setLeaderboardWeek(e.target.value)} className="bg-transparent font-black focus:outline-none cursor-pointer">
                  {leaderboardWeekOptions.map(opt => (
                    <option key={opt.id} value={opt.id} className="text-slate-900">{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`p-4 rounded-3xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              {classLeaderboard.map((item, index) => (
                <div key={index} className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${item.isSelf ? 'ring-2 ring-sky-400 bg-sky-50 dark:bg-slate-700/80 border-sky-300' : 'bg-white dark:bg-slate-700/30 border-slate-100 dark:border-slate-700'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-sky-100 dark:bg-slate-600 text-2xl border border-sky-200 dark:border-slate-500 shadow-sm">
                      {item.avatar.startsWith('data:') || item.avatar.startsWith('http') ? (
                        <img src={item.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        item.avatar
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {item.name}
                      {item.isSelf && <span className="text-[10px] bg-sky-500 text-white px-2 py-0.2 rounded-full font-black">Bé nhà bạn</span>}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 font-black text-amber-500">
                    <span>{item.stars}</span>
                    <IconStar className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: THỐNG KÊ */}
        {currentTab === 'stats' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📈 Phong độ qua các {statsView === 'week' ? 'tuần' : 'tháng'} <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">(đã gồm điểm thưởng/phạt)</span></span>
                </h2>
                <div className="flex p-1 rounded-xl bg-sky-100 dark:bg-slate-700">
                  {[
                    { id: 'week', label: 'Theo tuần' },
                    { id: 'month', label: 'Theo tháng' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatsView(opt.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        statsView === opt.id
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-sky-800 hover:bg-sky-200 dark:text-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const chartData = statsView === 'week' ? statsData.weekly : statsData.monthly;
                if (chartData.length === 0) {
                  return <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">Chưa có dữ liệu lịch sử các tuần trước.</p>;
                }
                const total = chartData.reduce((sum, d) => sum + d.stars, 0);
                const avg = Math.round((total / chartData.length) * 10) / 10;
                const best = chartData.reduce((m, d) => (d.stars > m.stars ? d : m), chartData[0]);
                return (
                  <div className="space-y-3">
                    <LineChart data={chartData} goal={statsView === 'week' ? weeklyGoal : null} />
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-slate-700/60 border border-sky-100 dark:border-slate-600">
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Tổng sao</p>
                        <p className="font-black text-sm text-slate-900 dark:text-white">{total} ⭐</p>
                      </div>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-slate-700/60 border border-sky-100 dark:border-slate-600">
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Trung bình / {statsView === 'week' ? 'tuần' : 'tháng'}</p>
                        <p className="font-black text-sm text-slate-900 dark:text-white">{avg} ⭐</p>
                      </div>
                      <div className="p-2 rounded-xl bg-sky-50 dark:bg-slate-700/60 border border-sky-100 dark:border-slate-600">
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">Cao nhất ({best.label})</p>
                        <p className="font-black text-sm text-slate-900 dark:text-white">{best.stars} ⭐</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">📜 Lịch Sử Thưởng / Phạt Đột Xuất</h2>
              {bonusHistory.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">Chưa có lịch sử thưởng / phạt ngoại lệ nào.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bonusHistory.map(log => (
                    <div key={log.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${log.points > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'}`}>
                      <div>
                        <p className="font-bold">{log.reason}</p>
                        <p className="text-[10px] opacity-75">{log.time} - {log.date} ({log.week})</p>
                      </div>
                      <span className="font-black text-sm">{log.points > 0 ? `+${log.points}` : log.points} ⭐</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CÀI ĐẶT */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 text-slate-900 dark:text-white border-sky-100 dark:border-slate-700">👤 Thông tin & Avatar của bé</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-800 dark:text-slate-200">Tên của bé</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-800 dark:text-slate-200">Avatar (Chọn emoji hoặc Tải ảnh từ máy)</label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-sky-300 bg-sky-100 dark:bg-slate-700 dark:border-slate-600 flex items-center justify-center text-3xl shadow-sm">
                      {childAvatar.startsWith('data:') || childAvatar.startsWith('http') ? (
                        <img src={childAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        childAvatar
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => setPickerTarget('avatar')}
                        className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        😊 Chọn Emoji
                      </button>
                      <label className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">
                        📁 Tải ảnh lên
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-800 dark:text-slate-200">Mục tiêu sao mỗi tuần</label>
                  <input
                    type="number"
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 10)}
                    className="w-28 px-3 py-2 text-sm rounded-xl border font-bold bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 text-slate-900 dark:text-white border-sky-100 dark:border-slate-700">🏆 Bảng vàng lớp</h3>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Tham gia Bảng vàng</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Khi bật, tên, emoji và số sao mỗi tuần của bé hiện trên bảng xếp hạng cho các bạn trong lớp.
                    Khi tắt, thông tin của bé được xóa khỏi bảng vàng, các bạn không nhìn thấy, và bé cũng không xem được bảng này.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={joinLeaderboard}
                  onClick={() => setJoinLeaderboard(!joinLeaderboard)}
                  className={`relative shrink-0 w-12 h-7 rounded-full transition-colors ${joinLeaderboard ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${joinLeaderboard ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 text-slate-900 dark:text-white border-sky-100 dark:border-slate-700">📋 Danh sách nhiệm vụ</h3>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ type: 'task', id: task.id })}
                      className="w-10 h-10 text-xl rounded-xl border bg-sky-50 border-sky-200 dark:bg-slate-700 dark:border-slate-600 shadow-sm flex items-center justify-center hover:bg-sky-100 dark:hover:bg-slate-600"
                    >
                      {task.icon}
                    </button>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, name: e.target.value } : t))}
                      className="flex-1 px-3 py-2 text-sm rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                    />
                    <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="px-2.5 py-1.5 text-xs bg-rose-100 text-rose-600 rounded-xl font-bold">Xóa</button>
                  </div>
                ))}
                <button
                  onClick={() => setTasks([...tasks, { id: 't_' + Date.now(), name: 'Nhiệm vụ mới', icon: '🌟' }])}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm dark:bg-sky-900/30 dark:hover:bg-sky-900/50 dark:text-sky-300 dark:border dark:border-dashed dark:border-sky-300"
                >
                  + Thêm nhiệm vụ mới
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-sky-200 shadow-sm'}`}>
              <h3 className="font-bold text-sm border-b pb-2 text-slate-900 dark:text-white border-sky-100 dark:border-slate-700">🎁 Cài đặt phần thưởng</h3>
              <div className="space-y-2">
                {rewards.map(reward => (
                  <div key={reward.id} className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ type: 'reward', id: reward.id })}
                      className="w-10 h-10 text-xl rounded-xl border bg-sky-50 border-sky-200 dark:bg-slate-700 dark:border-slate-600 shadow-sm flex items-center justify-center hover:bg-sky-100 dark:hover:bg-slate-600"
                    >
                      {reward.icon}
                    </button>
                    <input
                      type="text"
                      value={reward.name}
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? { ...r, name: e.target.value } : r))}
                      className="flex-1 px-3 py-2 text-sm rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                    />
                    <input
                      type="number"
                      value={reward.cost}
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? { ...r, cost: parseInt(e.target.value) || 0 } : r))}
                      className="w-20 px-2 py-2 text-sm text-center font-bold rounded-xl border bg-white border-slate-300 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm"
                    />
                    <button onClick={() => setRewards(rewards.filter(r => r.id !== reward.id))} className="px-2.5 py-1.5 text-xs bg-rose-100 text-rose-600 rounded-xl font-bold">Xóa</button>
                  </div>
                ))}
                <button
                  onClick={() => setRewards([...rewards, { id: 'r_' + Date.now(), name: 'Phần thưởng mới', icon: '🎁', cost: 10 }])}
                  className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm dark:bg-sky-900/30 dark:hover:bg-sky-900/50 dark:text-sky-300 dark:border dark:border-dashed dark:border-sky-300"
                >
                  + Thêm phần thưởng mới
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
              >
                Đăng Xuất ({user.email || user.name})
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER NAVIGATION MENU */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 px-3 py-2 border-t backdrop-blur-lg transition-colors print:hidden ${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-sky-200 shadow-lg'}`}>
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
                  ? 'bg-sky-500 text-white font-black scale-105 shadow-sm'
                  : 'opacity-70 hover:opacity-100 text-slate-700 dark:text-slate-300'
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
