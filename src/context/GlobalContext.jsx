import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    GithubAuthProvider
} from "firebase/auth";
import { doc, setDoc, deleteDoc, collection, query, orderBy, limit, getDocs, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from '../api/firebase'; 

// --- NATIVE CAPACITOR IMPORTS ---
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    
    // --- 1. UI STATE ---
    const [currentView, setCurrentView] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('shakzz_current_view') || 'home';
        }
        return 'home';
    });
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // 🚀 NEW: GLOBAL REFRESH TRIGGER
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const triggerGlobalRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // --- NETWORK OFFLINE DETECTOR ---
    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            showToast("SYSTEM ONLINE: Connection Restored", "success");
            triggerGlobalRefresh(); // Auto-refresh data when internet comes back
        };
        
        const handleOffline = () => {
            setIsOffline(true);
            showToast("SYSTEM ERROR: No Internet Connection", "error");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    
    // --- TOAST SYSTEM ---
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (text, type = 'success') => {
        setToastMessage({ text, type });
        // Auto-hide after 3 seconds
        setTimeout(() => setToastMessage(null), 3000); 
    };
    
    // --- 2. USER DATA ---
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    // 🚀 NEW: TOP 10 DATA STATE
    const [top10Movies, setTop10Movies] = useState([]);

    // --- 3. DETAIL & PLAYER STATE ---
    const [detailItem, setDetailItem] = useState(() => {
        try { return JSON.parse(localStorage.getItem('shakzz_active_item')) || null; } catch { return null; }
    });

    const [isDetailOpen, setIsDetailOpen] = useState(() => {
        try { return JSON.parse(localStorage.getItem('shakzz_detail_open')) || false; } catch { return false; }
    });

    const [isPlayerOpen, setIsPlayerOpen] = useState(() => {
        try { return JSON.parse(localStorage.getItem('shakzz_player_open')) || false; } catch { return false; }
    });

    // --- 4. MODALS ---
    const [categoryModal, setCategoryModal] = useState(() => {
        try { 
            return JSON.parse(localStorage.getItem('shakzz_category_modal')) || { isOpen: false, title: '', endpoint: '' }; 
        } catch { 
            return { isOpen: false, title: '', endpoint: '' }; 
        }
    });

    const [infoModal, setInfoModal] = useState({ isOpen: false, type: '' });
    const [searchModal, setSearchModal] = useState({ isOpen: false, mode: 'search' }); 

    // --- 5. MASTER SAVE EFFECT ---
    useEffect(() => {
        localStorage.setItem('shakzz_current_view', currentView);
        localStorage.setItem('shakzz_active_item', JSON.stringify(detailItem));
        localStorage.setItem('shakzz_detail_open', JSON.stringify(isDetailOpen));
        localStorage.setItem('shakzz_player_open', JSON.stringify(isPlayerOpen));
        localStorage.setItem('shakzz_category_modal', JSON.stringify(categoryModal));
    }, [currentView, detailItem, isDetailOpen, isPlayerOpen, categoryModal]);

    const switchView = (view) => {
        setCurrentView(view);
        setSearchModal({ ...searchModal, isOpen: false });
        setIsSidebarOpen(false);
        setIsPlayerOpen(false); 
        setIsDetailOpen(false); 
        window.scrollTo(0, 0);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const showLoader = (msg = "Loading...") => {
        setLoadingMessage(msg);
        setIsLoading(true);
    };

    const hideLoader = () => {
        setTimeout(() => setIsLoading(false), 500);
    };

    // --- AUTHENTICATION LISTENER ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                localStorage.setItem('isLoggedIn', 'true');
                loadUserData(currentUser.uid);
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                setHistory([]);
                setWatchlist([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // --- GLOBAL DATA FETCHING (Linked to Pull-to-Refresh) ---
    useEffect(() => {
        const fetchTop10Data = async () => {
            try {
                // TODO: Replace this with your actual TMDB/API fetch logic
                // const res = await fetch('YOUR_API_ENDPOINT_HERE');
                // const data = await res.json();
                // setTop10Movies(data.results.slice(0, 10));
                
                // Temporary dummy data so the UI renders while you hook up the API
                setTop10Movies([
                    { id: 1, title: "Solo Leveling", posterUrl: "https://image.tmdb.org/t/p/w500/geCRueVbWQRaQyXEJQ2Q3CEXKk3.jpg", isHD: true },
                    { id: 2, title: "Jujutsu Kaisen", posterUrl: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrptjvFcLb4Fkw.jpg", isNew: true },
                    { id: 3, title: "One Piece", posterUrl: "https://image.tmdb.org/t/p/w500/cMD9Ypuv7iU21NImkM5rSuhV8j.jpg", isHD: true }
                ]);
            } catch (error) {
                console.error("Failed to fetch Top 10 data:", error);
            }
        };

        // Fire this whenever the app loads OR when the user pulls to refresh
        fetchTop10Data();
    }, [refreshTrigger]);

    // --- GOOGLE LOGIN ---
    const loginGoogle = async () => {
        try { 
            if (Capacitor.isNativePlatform()) {
                const result = await FirebaseAuthentication.signInWithGoogle();
                const credential = GoogleAuthProvider.credential(result.credential?.idToken);
                await signInWithCredential(auth, credential);
            } else {
                await signInWithPopup(auth, googleProvider); 
            }
            showToast("Successfully logged in!", "success");
        } catch (e) { 
            console.error("Google Login Error:", e);
            showToast(`Login canceled or failed.`, "error");
        }
    };

    // --- GITHUB LOGIN ---
    const loginGithub = async () => {
        try { 
            if (Capacitor.isNativePlatform()) {
                const result = await FirebaseAuthentication.signInWithGithub();
                const credential = GithubAuthProvider.credential(result.credential?.accessToken);
                await signInWithCredential(auth, credential);
            } else {
                await signInWithPopup(auth, githubProvider); 
            }
            showToast("Successfully logged in!", "success");
        } catch (e) { 
            console.error("Github Login Error:", e);
            showToast(`Login canceled or failed.`, "error");
        }
    };

    // --- LOGOUT ---
    const doLogout = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                await FirebaseAuthentication.signOut();
            }
            await signOut(auth);
            showToast("Successfully logged out!", "success");
        } catch (e) {
            console.error("Logout Error:", e);
            showToast("Logout failed!", "error");
        }
    };

    const loadUserData = async (uid) => {
        try {
            const histRef = collection(db, "users", uid, "history");
            const qHist = query(histRef, orderBy("timestamp", "desc"), limit(30));
            const histSnap = await getDocs(qHist);
            const histData = histSnap.docs.map(d => d.data());
            histData.sort((a, b) => (b.pinned === true ? 1 : 0) - (a.pinned === true ? 1 : 0));
            setHistory(histData);

            const watchRef = collection(db, "users", uid, "watchlist");
            const qWatch = query(watchRef, orderBy("added_at", "desc"));
            const watchSnap = await getDocs(qWatch);
            setWatchlist(watchSnap.docs.map(d => d.data()));
        } catch (error) {
            console.error("Data Load Error:", error);
            showToast("Failed to sync cloud data.", "error");
        }
    };

    // --- HISTORY MANAGEMENT ---
    const addToHistory = async (item, season = null, episode = null) => {
        if (!user) return;
        
        let label = "Movie";
        if (item.media_type === 'tv' || item.first_air_date) {
            const s = season || 1;
            const e = episode || 1;
            label = `S${s}:E${e}`;
        }

        const data = {
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path || item.poster_path,
            badge_label: label,
            media_type: item.media_type || (item.title ? 'movie' : 'tv'),
            vote_average: item.vote_average || 0,
            release_date: item.release_date || item.first_air_date || '',
            timestamp: new Date().toISOString(),
            progress: 45,
            pinned: item.pinned || false
        };

        setHistory(prev => {
            const filtered = prev.filter(i => i.id !== item.id);
            const updated = [data, ...filtered];
            updated.sort((a, b) => (b.pinned === true ? 1 : 0) - (a.pinned === true ? 1 : 0));
            return updated;
        });
        
        try {
            await setDoc(doc(db, "users", user.uid, "history", item.id.toString()), data);
        } catch (e) { 
            console.error(e); 
        }
    };

    const removeFromHistory = async (id) => {
        if (!user) return;
        setHistory(prev => prev.filter(item => item.id !== id));
        try { await deleteDoc(doc(db, "users", user.uid, "history", id.toString())); } catch (e) {}
    };

    const togglePin = async (id) => {
        if (!user) return;
        let newItem = null;
        setHistory(prev => {
            const updated = prev.map(item => {
                if (item.id === id) { newItem = { ...item, pinned: !item.pinned }; return newItem; }
                return item;
            });
            updated.sort((a, b) => (b.pinned === true ? 1 : 0) - (a.pinned === true ? 1 : 0));
            return updated;
        });
        if (newItem) {
            try { await updateDoc(doc(db, "users", user.uid, "history", id.toString()), { pinned: newItem.pinned }); } catch (e) {}
        }
    };

    const toggleWatchlist = async (item) => {
        if (!user) {
            showToast("Please sign in to save favorites.", "error");
            return;
        }
        
        const isAdded = watchlist.some(i => i.id === item.id);
        const docRef = doc(db, "users", user.uid, "watchlist", item.id.toString());

        try {
            if (isAdded) {
                setWatchlist(prev => prev.filter(i => i.id !== item.id));
                await deleteDoc(docRef);
                showToast("Removed from favorites", "success");
            } else {
                const data = { ...item, added_at: new Date().toISOString() };
                setWatchlist(prev => [data, ...prev]);
                await setDoc(docRef, data);
                showToast("Added to favorites!", "success");
            }
        } catch (e) {
            console.error(e);
            showToast("Failed to update favorites.", "error");
        }
    };

    // --- CONTROLS ---
    const openDetail = (item) => {
        setDetailItem(item);
        setIsDetailOpen(true);
        setIsPlayerOpen(false); 
    };

    const closeDetail = () => {
        setDetailItem(null);
        setIsDetailOpen(false);
        setIsPlayerOpen(false);
        localStorage.removeItem('shakzz_active_item');
        localStorage.removeItem('shakzz_detail_open');
        localStorage.removeItem('shakzz_player_open');
    };

    return (
        <GlobalContext.Provider value={{
            isOffline, currentView, isSidebarOpen, isLoading, loadingMessage,
            user, history, watchlist,
            top10Movies, // 🚀 EXPORTING TOP 10 DATA
            detailItem, isDetailOpen, isPlayerOpen,
            infoModal, searchModal, categoryModal,
            refreshTrigger, triggerGlobalRefresh, 
            db, switchView, toggleSidebar, showLoader, hideLoader,
            loginGoogle, loginGithub, doLogout,
            addToHistory, removeFromHistory, togglePin, toggleWatchlist,
            setInfoModal, setSearchModal, setCategoryModal,
            setDetailItem, setIsPlayerOpen, 
            openDetail, closeDetail,
            showToast 
        }}>
            {children}

            {/* --- GLOBAL TOAST COMPONENT INJECTED AT THE ROOT --- */}
            <div className={`shakzz-toast ${toastMessage ? 'show' : ''} ${toastMessage?.type || ''}`}>
                <span>{toastMessage?.type === 'success' ? '✅' : '❌'}</span>
                {toastMessage?.text}
            </div>

        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);