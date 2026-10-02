import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  collection,
} from 'firebase/firestore';

// --- CẤU HÌNH FIREBASE CỦA BẠN SẼ ĐIỀN VÀO ĐÂY ---
let firebaseConfig = {
  apiKey: 'AIzaSyDVlG4hRwmUbvQ8Rk1QIo4co5zN8jzooGQ',
  authDomain: 'dashboard-class-1b.firebaseapp.com',
  projectId: 'dashboard-class-1b',
  storageBucket: 'dashboard-class-1b.firebasestorage.app',
  messagingSenderId: '803151730368',
  appId: '1:803151730368:web:1e3d3c7d19480923b73f25',
};
let appId = 'bang-khen-thuong-lop';

// Tương thích với môi trường giả lập
if (typeof __firebase_config !== 'undefined') {
  firebaseConfig = JSON.parse(__firebase_config);
}
if (typeof __app_id !== 'undefined') {
  appId = __app_id;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const IconStar = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconSettings = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconGift = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);
const IconCheck = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconPlus = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconTrash2 = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const IconEdit = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconAward = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
const IconCalendarDays = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);
const IconChart = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconTarget = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconPartyPopper = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5.8 11.3 2 22l10.7-3.79" />
    <path d="M4 3h.01" />
    <path d="M22 8h.01" />
    <path d="M15 2h.01" />
    <path d="M22 20h.01" />
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
  </svg>
);
const IconMinus = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCloud = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const IconCloudOff = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.61 16.95A4.5 4.5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a4.5 4.5 0 0 0 1.73-.35M1 1l22 22" />
  </svg>
);
const IconLogOut = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconTrophy = ({ className, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
  </svg>
);

const DAYS_OF_WEEK = [
  { id: 0, label: 'T2' },
  { id: 1, label: 'T3' },
  { id: 2, label: 'T4' },
  { id: 3, label: 'T5' },
  { id: 4, label: 'T6' },
  { id: 5, label: 'T7' },
  { id: 6, label: 'CN' },
];

const DEFAULT_TASKS = [
  { id: '1', name: 'Đánh răng sáng tối', emoji: '🪥' },
  { id: '2', name: 'Dọn dẹp đồ chơi', emoji: '🧸' },
  { id: '3', name: 'Ăn hết phần cơm', emoji: '🍚' },
];

const DEFAULT_REWARDS = [
  { id: '1', name: 'Đi ăn kem', cost: 10, emoji: '🍦' },
  { id: '2', name: 'Xem phim', cost: 15, emoji: '🎬' },
];

export default function KidRewardApp() {
  // Auth State
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sync Status
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState('loading');

  // App States (Private Data)
  const [kidName, setKidName] = useState('Bé Ngoan');
  const [isShared, setIsShared] = useState(false);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);
  const [progress, setProgress] = useState({});
  const [bankedStars, setBankedStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(20);
  const [adjustmentHistory, setAdjustmentHistory] = useState([]);

  // Public Data (Leaderboard)
  const [leaderboard, setLeaderboard] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState('board');
  const [showToast, setShowToast] = useState(null);
  const [chartViewMode, setChartViewMode] = useState('week');
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [adjustReason, setAdjustReason] = useState('');

  // Settings Form States
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskEmoji, setTaskEmoji] = useState('🌟');

  const [editingRewardId, setEditingRewardId] = useState(null);
  const [rewardName, setRewardName] = useState('');
  const [rewardEmoji, setRewardEmoji] = useState('🎁');
  const [rewardCost, setRewardCost] = useState(10);

  useEffect(() => {
    const autoLogin = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (e) {}
      }
    };
    autoLogin();

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (!currentUser) setIsDataLoaded(false);
    });
    return () => unsubAuth();
  }, []);

  // Tải dữ liệu cá nhân
  useEffect(() => {
    if (!user) return;
    const docRef = doc(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'appData',
      'main'
    );

    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKidName(data.kidName || 'Bé Ngoan');
          setIsShared(data.isShared || false);
          setTasks(data.tasks || DEFAULT_TASKS);
          setRewards(data.rewards || DEFAULT_REWARDS);
          setProgress(data.progress || {});
          setBankedStars(data.bankedStars || 0);
          setHistory(data.history || []);
          setWeeklyGoal(data.weeklyGoal || 20);
          setAdjustmentHistory(data.adjustmentHistory || []);
        }
        setIsDataLoaded(true);
        setSyncStatus('synced');
      },
      (err) => {
        console.error(err);
        setSyncStatus('error');
      }
    );

    return () => unsub();
  }, [user]);

  // Tải dữ liệu Bảng Vàng (Leaderboard) chung của lớp
  useEffect(() => {
    if (!user) return;
    const q = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'leaderboard'
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        // Sắp xếp điểm từ cao xuống thấp
        list.sort((a, b) => b.stars - a.stars);
        setLeaderboard(list);
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [user]);

  const calculateCurrentWeekStars = (currentProgress) => {
    let count = 0;
    Object.values(currentProgress || progress).forEach((taskProgress) => {
      Object.values(taskProgress).forEach((isDone) => {
        if (isDone) count++;
      });
    });
    return count;
  };

  // Hàm trung tâm để lưu dữ liệu lên Cloud (Cá nhân + Bảng chung)
  const saveToCloud = async (updates) => {
    if (!user) return;
    setSyncStatus('saving');

    // Gom dữ liệu trạng thái hiện tại (để chắc chắn lưu không sót)
    const currentState = {
      kidName,
      isShared,
      tasks,
      rewards,
      progress,
      bankedStars,
      history,
      weeklyGoal,
      adjustmentHistory,
    };
    const payload = { ...currentState, ...updates };

    try {
      // 1. Lưu dữ liệu riêng tư của tài khoản
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'appData', 'main'),
        payload
      );

      // 2. Xử lý chia sẻ lên Bảng Vàng
      const totalStars =
        payload.bankedStars + calculateCurrentWeekStars(payload.progress);

      if (payload.isShared) {
        // Cập nhật điểm lên bảng vàng
        await setDoc(
          doc(
            db,
            'artifacts',
            appId,
            'public',
            'data',
            'leaderboard',
            user.uid
          ),
          {
            kidName: payload.kidName || 'Ẩn danh',
            stars: totalStars,
            updatedAt: new Date().toISOString(),
          }
        );
      } else {
        // Nếu không share nữa thì xóa khỏi bảng vàng
        await deleteDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'leaderboard', user.uid)
        ).catch((e) => {});
      }

      setSyncStatus('synced');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (username.length < 3) {
      setAuthError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }

    // Thủ thuật biến Username thành Email ảo để qua mặt Firebase
    const safeUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const fakeEmail = `${safeUsername}@kidtracker.local`;

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, fakeEmail, password);
      } else {
        await createUserWithEmailAndPassword(auth, fakeEmail, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('Tên đăng nhập này đã có người sử dụng!');
      } else {
        setAuthError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    }
  };

  const triggerToast = (message, type) => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const toggleTaskProgress = (taskId, dayId) => {
    const taskProgress = progress[taskId] || {};
    const isCurrentlyDone = !!taskProgress[dayId];
    const newProgress = {
      ...progress,
      [taskId]: { ...taskProgress, [dayId]: !isCurrentlyDone },
    };
    setProgress(newProgress); // Optimistic UI
    saveToCloud({ progress: newProgress });
  };

  const handleAdjustPoints = (type) => {
    if (adjustAmount <= 0) return;
    const currentTotal = bankedStars + calculateCurrentWeekStars(progress);
    if (type === 'subtract' && currentTotal < adjustAmount) {
      triggerToast('Bé chưa có đủ số sao này để phạt!', 'error');
      return;
    }

    const amount = type === 'add' ? adjustAmount : -adjustAmount;
    const newBanked = bankedStars + amount;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${now.getFullYear()} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newAdjustment = {
      id: Date.now().toString(),
      type,
      amount: adjustAmount,
      reason:
        adjustReason || (type === 'add' ? 'Thưởng điểm' : 'Phạt trừ điểm'),
      date: formattedDate,
    };
    const newHistory = [newAdjustment, ...adjustmentHistory];

    setBankedStars(newBanked);
    setAdjustmentHistory(newHistory);
    saveToCloud({ bankedStars: newBanked, adjustmentHistory: newHistory });

    triggerToast(
      `Đã ${type === 'add' ? 'Thưởng' : 'Phạt trừ'} ${adjustAmount} sao`,
      type === 'add' ? 'party' : 'error'
    );
    setAdjustReason('');
    setAdjustAmount(1);
  };

  const startNewWeek = () => {
    const today = new Date();
    const currentWeekStars = calculateCurrentWeekStars(progress);
    const newHistoryRecord = {
      id: Date.now().toString(),
      name: `Tuần ${history.length + 1}`,
      stars: currentWeekStars,
      goal: weeklyGoal,
      date: `${today.getDate().toString().padStart(2, '0')}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${today.getFullYear()}`,
    };

    const newHistoryList = [...history, newHistoryRecord];
    const newBanked = bankedStars + currentWeekStars;

    setHistory(newHistoryList);
    setBankedStars(newBanked);
    setProgress({});
    saveToCloud({
      history: newHistoryList,
      bankedStars: newBanked,
      progress: {},
    });

    triggerToast(
      `Đã lưu ${currentWeekStars} sao và bắt đầu tuần mới!`,
      'success'
    );
  };

  const claimReward = (reward) => {
    const totalStars = bankedStars + calculateCurrentWeekStars(progress);
    if (totalStars >= reward.cost) {
      const newBanked = totalStars - reward.cost;
      setBankedStars(newBanked);
      setProgress({});
      saveToCloud({ bankedStars: newBanked, progress: {} });
      triggerToast(
        `Hoan hô! Bé đã đổi được: ${reward.name} ${reward.emoji}`,
        'party'
      );
    } else {
      triggerToast('Bé chưa đủ điểm rồi, hãy cố gắng thêm nhé!', 'error');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center font-bold text-sky-500">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-sky-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-sky-800 tracking-tight flex items-center justify-center gap-2">
              <IconStar className="fill-amber-400 text-amber-500" /> Bé Ngoan
            </h1>
            <p className="text-sky-600 font-medium mt-2">
              Dùng chung cho cả lớp
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tên đăng nhập (VD: cun_con_123)"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-300 transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mật khẩu"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-300 transition-colors"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm font-bold text-center">
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-lg shadow-md transition-all active:scale-95"
            >
              {authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-sky-600 font-medium hover:underline"
            >
              {authMode === 'login'
                ? 'Tạo tài khoản mới cho bé'
                : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center text-sky-500 font-bold">
        Đang tải dữ liệu bé...
      </div>
    );
  }

  const currentWeekStars = calculateCurrentWeekStars(progress);
  const totalStars = bankedStars + currentWeekStars;

  const renderBoard = () => {
    const progressPercent = Math.min(
      100,
      Math.round((currentWeekStars / (weeklyGoal || 1)) * 100)
    );

    return (
      <div className="space-y-6 pb-24">
        {/* Weekly Goal Progress Bar */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-sky-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sky-800 flex items-center gap-2">
              <IconTarget className="text-sky-500" /> Mục tiêu tuần này
            </h3>
            <span className="font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full text-sm">
              {currentWeekStars} / {weeklyGoal}{' '}
              <IconStar
                size={14}
                className="inline fill-amber-400 text-amber-400 mb-1"
              />
            </span>
          </div>
          <div className="h-4 bg-sky-50 rounded-full overflow-hidden w-full relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-300 to-sky-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={startNewWeek}
            className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            Lưu điểm & Bắt đầu tuần mới
          </button>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Chưa có nhiệm vụ nào. Ba mẹ hãy vào Cài đặt để thêm nhé!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-sky-50/50">
                    <th className="sticky left-0 bg-sky-50/95 z-10 p-4 border-b border-sky-100 text-left text-sky-800 font-bold backdrop-blur-sm">
                      Nhiệm vụ
                    </th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th
                        key={day.id}
                        className="p-3 border-b border-sky-100 text-sky-800 font-bold w-16"
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="sticky left-0 bg-white z-10 p-4 border-b border-r border-sky-50 text-left flex items-center gap-3">
                        <span className="text-3xl bg-sky-50 p-2 rounded-2xl leading-none">
                          {task.emoji}
                        </span>
                        <span className="font-semibold text-gray-700 whitespace-nowrap">
                          {task.name}
                        </span>
                      </td>
                      {DAYS_OF_WEEK.map((day) => {
                        const isDone = progress[task.id]?.[day.id] || false;
                        return (
                          <td
                            key={day.id}
                            className="p-2 border-b border-sky-50"
                          >
                            <button
                              onClick={() =>
                                toggleTaskProgress(task.id, day.id)
                              }
                              className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                                isDone
                                  ? 'bg-amber-100 scale-110 shadow-sm'
                                  : 'bg-gray-100 hover:bg-sky-100 active:scale-95'
                              }`}
                            >
                              {isDone ? (
                                <IconStar
                                  size={26}
                                  className="fill-amber-400 text-amber-500"
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Adjust Points */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-sky-100 mt-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <IconStar className="text-amber-500 fill-amber-400" /> Thưởng / Phạt
            điểm ngoại lệ
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Lý do (VD: Giúp mẹ quét nhà...)"
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-300"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value) || 1)}
                className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-center font-bold outline-none focus:border-sky-300"
              />
              <button
                onClick={() => handleAdjustPoints('add')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl font-bold flex items-center justify-center gap-1 transition-all active:scale-95 flex-1 sm:flex-none"
              >
                <IconPlus size={18} /> Thưởng
              </button>
              <button
                onClick={() => handleAdjustPoints('subtract')}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl font-bold flex items-center justify-center gap-1 transition-all active:scale-95 flex-1 sm:flex-none"
              >
                <IconMinus size={18} /> Phạt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center bg-gradient-to-r from-amber-200 to-yellow-400 rounded-3xl p-8 shadow-sm mb-6 relative overflow-hidden">
          <IconTrophy
            size={100}
            className="absolute -right-6 -bottom-6 text-yellow-500 opacity-20"
          />
          <h2 className="text-2xl font-black text-amber-900 mb-2 relative z-10">
            BẢNG VÀNG LỚP HỌC
          </h2>
          <p className="text-amber-800 font-medium relative z-10">
            Cùng xem bạn nào đang dẫn đầu nhé!
          </p>
        </div>

        {!isShared && (
          <div className="bg-white p-4 rounded-2xl border border-dashed border-gray-300 text-center mb-6">
            <p className="text-gray-600 text-sm">
              Điểm của bé đang được ẩn. Vào phần <strong>Cài Đặt</strong> để bật
              chia sẻ điểm lên bảng vàng nhé!
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Chưa có bạn nào tham gia bảng vàng.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboard.map((kid, index) => {
                const isMe = kid.id === user.uid;
                let rankStyle = 'bg-white text-gray-600';
                let rankIcon = (
                  <span className="font-bold text-gray-400">#{index + 1}</span>
                );

                if (index === 0) {
                  rankStyle = 'bg-yellow-50';
                  rankIcon = <span className="text-2xl">🥇</span>;
                } else if (index === 1) {
                  rankStyle = 'bg-gray-50';
                  rankIcon = <span className="text-2xl">🥈</span>;
                } else if (index === 2) {
                  rankStyle = 'bg-orange-50';
                  rankIcon = <span className="text-2xl">🥉</span>;
                }

                return (
                  <div
                    key={kid.id}
                    className={`flex items-center justify-between p-4 ${rankStyle} ${
                      isMe ? 'ring-2 ring-inset ring-amber-400' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 text-center">{rankIcon}</div>
                      <div className="font-bold text-lg text-gray-800">
                        {kid.kidName}{' '}
                        {isMe && (
                          <span className="text-xs bg-amber-400 text-white px-2 py-0.5 rounded-full ml-2">
                            Bạn
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-black text-amber-500 text-xl flex items-center gap-1">
                      {kid.stars}{' '}
                      <IconStar
                        size={20}
                        className="fill-amber-400 text-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    // Form actions (unchanged logic)
    const saveTask = (e) => {
      e.preventDefault();
      if (!taskName) return;
      let newTasks;
      if (editingTaskId) {
        newTasks = tasks.map((t) =>
          t.id === editingTaskId
            ? { ...t, name: taskName, emoji: taskEmoji }
            : t
        );
        triggerToast('Đã cập nhật!', 'success');
      } else {
        newTasks = [
          ...tasks,
          { id: Date.now().toString(), name: taskName, emoji: taskEmoji },
        ];
        triggerToast('Đã thêm!', 'success');
      }
      setTasks(newTasks);
      saveToCloud({ tasks: newTasks });
      setEditingTaskId(null);
      setTaskName('');
      setTaskEmoji('🌟');
    };

    const saveReward = (e) => {
      e.preventDefault();
      if (!rewardName) return;
      let newRewards;
      if (editingRewardId) {
        newRewards = rewards.map((r) =>
          r.id === editingRewardId
            ? { ...r, name: rewardName, emoji: rewardEmoji, cost: rewardCost }
            : r
        );
      } else {
        newRewards = [
          ...rewards,
          {
            id: Date.now().toString(),
            name: rewardName,
            emoji: rewardEmoji,
            cost: rewardCost,
          },
        ];
      }
      setRewards(newRewards);
      saveToCloud({ rewards: newRewards });
      setEditingRewardId(null);
      setRewardName('');
      setRewardEmoji('🎁');
      setRewardCost(10);
    };

    return (
      <div className="space-y-8 pb-24 max-w-2xl mx-auto">
        {/* Profile / Kid Info Settings */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IconStar className="text-sky-500 fill-sky-200" /> Thông tin của bé
          </h2>

          <div className="space-y-6 z-10 relative">
            <div>
              <label className="text-sm font-bold text-gray-600 block mb-2">
                Tên bé (Hiển thị trên bảng vàng)
              </label>
              <input
                type="text"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                onBlur={() => saveToCloud({ kidName })}
                placeholder="Ví dụ: Cu Tí, Kẹo Mút..."
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-300 font-bold text-gray-800"
              />
            </div>

            <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <div>
                <label className="text-base font-bold text-amber-900 block">
                  Tham gia Bảng Vàng
                </label>
                <p className="text-xs text-amber-700 mt-1 pr-4">
                  Chia sẻ tổng điểm của bé với cả lớp để cùng thi đua
                </p>
              </div>
              <button
                onClick={() => {
                  const newVal = !isShared;
                  setIsShared(newVal);
                  saveToCloud({ isShared: newVal });
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isShared ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isShared ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <IconTarget className="text-emerald-500" /> Mục tiêu tuần
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={weeklyGoal}
              onChange={(e) => {
                setWeeklyGoal(Number(e.target.value) || 0);
                saveToCloud({ weeklyGoal: Number(e.target.value) || 0 });
              }}
              className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-center font-bold text-lg outline-none focus:border-emerald-300"
            />
            <IconStar className="fill-amber-400 text-amber-500" size={28} />
          </div>
        </div>

        {/* Task Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IconCheck className="text-sky-500" /> Nhiệm vụ hàng ngày
          </h2>
          <form onSubmit={saveTask} className="flex gap-2 mb-6">
            <input
              type="text"
              value={taskEmoji}
              onChange={(e) => setTaskEmoji(e.target.value)}
              className="w-16 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xl"
            />
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Tên nhiệm vụ..."
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-sky-300"
            />
            <button
              type="submit"
              className="p-3 bg-sky-500 hover:bg-sky-600 rounded-2xl text-white font-bold"
            >
              {editingTaskId ? 'Lưu' : <IconPlus />}
            </button>
          </form>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
              >
                <span className="font-medium">
                  <span className="text-3xl bg-white p-1 rounded-xl shadow-sm mr-2">
                    {task.emoji}
                  </span>{' '}
                  {task.name}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setTaskName(task.name);
                      setTaskEmoji(task.emoji);
                    }}
                    className="text-gray-400 p-2"
                  >
                    <IconEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      const n = tasks.filter((t) => t.id !== task.id);
                      setTasks(n);
                      saveToCloud({ tasks: n });
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <IconTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Rewards Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IconAward className="text-rose-500" /> Quà đổi thưởng
          </h2>
          <form
            onSubmit={saveReward}
            className="flex flex-col sm:flex-row gap-2 mb-6"
          >
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                value={rewardEmoji}
                onChange={(e) => setRewardEmoji(e.target.value)}
                className="w-16 p-3 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xl"
              />
              <input
                type="text"
                value={rewardName}
                onChange={(e) => setRewardName(e.target.value)}
                placeholder="Tên quà..."
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-rose-300"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={rewardCost}
                onChange={(e) => setRewardCost(Number(e.target.value))}
                className="w-20 p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-center outline-none focus:border-rose-300"
              />
              <button
                type="submit"
                className="p-3 bg-rose-500 hover:bg-rose-600 rounded-2xl text-white font-bold"
              >
                {editingRewardId ? 'Lưu' : <IconPlus />}
              </button>
            </div>
          </form>
          <ul className="space-y-3">
            {rewards.map((reward) => (
              <li
                key={reward.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl"
              >
                <span className="font-medium">
                  <span className="text-3xl bg-white p-1 rounded-xl shadow-sm mr-2">
                    {reward.emoji}
                  </span>{' '}
                  {reward.name}
                  <span className="text-amber-600 text-xs font-bold ml-2">
                    ({reward.cost}⭐)
                  </span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingRewardId(reward.id);
                      setRewardName(reward.name);
                      setRewardEmoji(reward.emoji);
                      setRewardCost(reward.cost);
                    }}
                    className="text-gray-400 p-2"
                  >
                    <IconEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      const n = rewards.filter((r) => r.id !== reward.id);
                      setRewards(n);
                      saveToCloud({ rewards: n });
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <IconTrash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Account Zone */}
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-red-800">Tài khoản</h3>
            <p className="text-sm text-red-600">Đã đăng nhập</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="bg-white text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 shadow-sm transition-colors"
          >
            <IconLogOut size={18} /> Đăng xuất
          </button>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    const getChartData = () => {
      if (chartViewMode === 'week') return history;
      const monthlyMap = {};
      history.forEach((record) => {
        const parts = record.date.split('/');
        let monthKey =
          parts.length >= 2
            ? `Tháng ${parts[1]}/${
                parts.length === 3 ? parts[2] : new Date().getFullYear()
              }`
            : 'Khác';
        if (!monthlyMap[monthKey])
          monthlyMap[monthKey] = {
            date: monthKey,
            name: monthKey,
            stars: 0,
            goal: 0,
          };
        monthlyMap[monthKey].stars += record.stars;
        monthlyMap[monthKey].goal += record.goal;
      });
      return Object.values(monthlyMap);
    };

    return (
      <div className="space-y-6 pb-24">
        {/* Biểu đồ */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <IconChart className="text-indigo-500" /> Phong độ
            </h2>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setChartViewMode('week')}
                className={`px-3 py-1 text-sm font-bold rounded-lg ${
                  chartViewMode === 'week'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setChartViewMode('month')}
                className={`px-3 py-1 text-sm font-bold rounded-lg ${
                  chartViewMode === 'month'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                Tháng
              </button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getChartData()}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey={chartViewMode === 'week' ? 'date' : 'name'}
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip /> <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  name="Điểm"
                  dataKey="stars"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStars)"
                />
                <Area
                  type="step"
                  name="Mục tiêu"
                  dataKey="goal"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lịch sử */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Lịch sử (Tuần)
            </h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {history
                .slice()
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                  >
                    <div>
                      <h4 className="font-bold text-gray-700">{record.name}</h4>
                      <p className="text-xs text-gray-500">{record.date}</p>
                    </div>
                    <div
                      className={`font-black text-lg ${
                        record.stars >= record.goal
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {record.stars} / {record.goal}{' '}
                      <IconStar size={16} className="inline fill-current" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Thưởng / Phạt
            </h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {adjustmentHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                >
                  <div>
                    <h4 className="font-bold text-gray-700">{record.reason}</h4>
                    <p className="text-xs text-gray-500">{record.date}</p>
                  </div>
                  <div
                    className={`font-black text-lg ${
                      record.type === 'add'
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    }`}
                  >
                    {record.type === 'add' ? '+' : '-'}
                    {record.amount}⭐
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRewards = () => (
    <div className="space-y-6 pb-24">
      <div className="text-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-rose-800 mb-2">
          Tổng điểm hiện có
        </h2>
        <div className="flex items-center justify-center gap-2 text-6xl font-black text-rose-500">
          {totalStars}{' '}
          <IconStar size={50} className="fill-amber-400 text-amber-400" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rewards.map((reward) => {
          const canAfford = totalStars >= reward.cost;
          return (
            <div
              key={reward.id}
              className="bg-white p-5 rounded-3xl shadow-sm border-2 border-pink-50 text-center"
            >
              <span className="text-6xl mb-3 mt-2 drop-shadow-sm block">
                {reward.emoji}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {reward.name}
              </h3>
              <button
                onClick={() => claimReward(reward)}
                className={`w-full py-3 rounded-2xl font-bold flex justify-center gap-2 ${
                  canAfford
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {reward.cost}{' '}
                <IconStar
                  size={20}
                  className={canAfford ? 'fill-yellow-300 text-yellow-300' : ''}
                />{' '}
                {canAfford ? 'Đổi ngay' : 'Chưa đủ'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans selection:bg-sky-200 flex flex-col">
      <header className="bg-white pt-8 pb-6 px-4 rounded-b-[40px] shadow-sm mb-6 z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-sky-50 rounded-br-full -z-10"></div>
        <div className="max-w-4xl mx-auto flex justify-between items-center z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black text-sky-800 tracking-tight">
                {kidName}
              </h1>
              <div
                className="flex p-1.5 rounded-full bg-gray-50"
                title={syncStatus}
              >
                {syncStatus === 'synced' && (
                  <IconCloud size={18} className="text-emerald-500" />
                )}
                {syncStatus === 'saving' && (
                  <IconCloud size={18} className="text-sky-500 animate-pulse" />
                )}
                {syncStatus === 'error' && (
                  <IconCloudOff size={18} className="text-rose-500" />
                )}
              </div>
            </div>
            <p className="text-sky-600 font-medium text-sm">
              Cùng con rèn luyện mỗi ngày
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-br from-amber-100 to-yellow-100 px-5 py-2.5 rounded-3xl shadow-sm border border-yellow-200">
            <IconStar size={36} className="text-amber-500 fill-amber-400" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase font-bold text-amber-700">
                Tổng Điểm
              </span>
              <span className="text-3xl font-black text-amber-600">
                {totalStars}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 max-w-4xl mx-auto w-full">
        {activeTab === 'board' && renderBoard()}
        {activeTab === 'rewards' && renderRewards()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
        <nav className="max-w-md mx-auto bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-sky-100 flex justify-between items-center gap-1">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-colors ${
              activeTab === 'board'
                ? 'bg-sky-100 text-sky-700'
                : 'text-gray-400 hover:text-sky-500'
            }`}
          >
            <IconCalendarDays size={22} />
            <span className="text-[9px] font-bold mt-1">Nhiệm Vụ</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-colors ${
              activeTab === 'rewards'
                ? 'bg-rose-100 text-rose-700'
                : 'text-gray-400 hover:text-rose-500'
            }`}
          >
            <IconGift size={22} />
            <span className="text-[9px] font-bold mt-1">Đổi Quà</span>
          </button>

          {/* Nút Bảng Vàng ở giữa, bự hơn một chút */}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all transform ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-b from-amber-200 to-yellow-400 text-amber-900 shadow-md scale-110 -translate-y-2'
                : 'bg-yellow-50 text-amber-500 hover:text-amber-600'
            }`}
          >
            <IconTrophy
              size={24}
              className={activeTab === 'leaderboard' ? 'fill-current' : ''}
            />
            <span className="text-[9px] font-bold mt-1">Bảng Vàng</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-colors ${
              activeTab === 'stats'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-400 hover:text-indigo-500'
            }`}
          >
            <IconChart size={22} />
            <span className="text-[9px] font-bold mt-1">Thống Kê</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-full transition-colors ${
              activeTab === 'settings'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-400 hover:text-emerald-500'
            }`}
          >
            <IconSettings size={22} />
            <span className="text-[9px] font-bold mt-1">Cài Đặt</span>
          </button>
        </nav>
      </div>

      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce w-max max-w-[90%]">
          <div
            className={`px-6 py-4 rounded-3xl shadow-lg border-2 flex items-center gap-3 ${
              showToast.type === 'party'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : showToast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {showToast.type === 'party' && (
              <IconPartyPopper className="text-rose-500" />
            )}
            <span className="font-bold text-lg">{showToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
