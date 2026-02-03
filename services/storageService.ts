import { User, UserLog, AccessKey, ChatSession, UserRole } from "../types";

// --- DATA LISTS (HARDCODED) ---

const MASTER_KEYS_DATA = [
  { l: "login01", p: "pA9!kL2@xQ" }, { l: "login02", p: "Z7#mP4!sT8" }, { l: "login03", p: "qW3@E9!Rk" }, { l: "login04", p: "8!FvS2@Lm" }, { l: "login05", p: "T4@Q!9pXr" },
  { l: "login06", p: "M!7S@2WkP" }, { l: "login07", p: "5@L!RkQ9F" }, { l: "login08", p: "P8!s@4MZQ" }, { l: "login09", p: "X!9@qL7Rk" }, { l: "login10", p: "@F45!8WQMp" },
  { l: "login11", p: "Q!9R@k4S2" }, { l: "login12", p: "M@P!7Q8Lk" }, { l: "login13", p: "6!R@X9FkQ" }, { l: "login14", p: "WQ!2@P9kL" }, { l: "login15", p: "8@!XkFQ7P" },
  { l: "login16", p: "Q9!@P4kRL" }, { l: "login17", p: "L!8@QkP7X" }, { l: "login18", p: "7Q!@RkF9P" }, { l: "login19", p: "X@P!kQ8F7" }, { l: "login20", p: "4!@QkL9PX" },
  { l: "login21", p: "Q!7@kF8XP" }, { l: "login22", p: "9P@!QXkFL" }, { l: "login23", p: "LQ!8@kXP7" }, { l: "login24", p: "5@!Qk9PXR" }, { l: "login25", p: "X!Q@7kPL9" },
  { l: "login26", p: "8!P@kQ7LX" }, { l: "login27", p: "Q@!P9Lk7X" }, { l: "login28", p: "6@Q!kXP9L" }, { l: "login29", p: "!Q9@PXLk7" }, { l: "login30", p: "P!@Q7L9kX" },
  { l: "login31", p: "7!@QkPXL9" }, { l: "login32", p: "QP!9@k7LX" }, { l: "login33", p: "X!Q@P9kL7" }, { l: "login34", p: "9!k@QPXL7" }, { l: "login35", p: "Q!@9kP7XL" },
  { l: "login36", p: "P@!Q9LXk7" }, { l: "login37", p: "7X!@QP9kL" }, { l: "login38", p: "!Q@P7Xk9L" }, { l: "login39", p: "L9!@QPXk7" }, { l: "login40", p: "QP@!7kXL9" },
  { l: "login41", p: "8!@QPXLk9" }, { l: "login42", p: "Q!P@k9XL7" }, { l: "login43", p: "!Q9@XPkL7" }, { l: "login44", p: "7@!QkXP9L" }, { l: "login45", p: "P!@Q9L7Xk" },
  { l: "login46", p: "Q@!XP7k9L" }, { l: "login47", p: "9!@QkPX7L" }, { l: "login48", p: "Q!@7kLPX" }, { l: "login49", p: "!Q@P9XkL7" }, { l: "login50", p: "7!Q@kLP9X" },
  { l: "login51", p: "P@!Q7X9kL" }, { l: "login52", p: "Q!9@XkLP7" }, { l: "login53", p: "8@!QP9kLX" }, { l: "login54", p: "!Q@7Pk9LX" }, { l: "login55", p: "QP!@9XkL7" },
  { l: "login56", p: "7!@QPk9LX" }, { l: "login57", p: "Q!@k9XP7L" }, { l: "login58", p: "9@!QPXk7L" }, { l: "login59", p: "!Q@P7L9Xk" }, { l: "login60", p: "Q!@9PXLk7" },
  { l: "login61", p: "7!@Q9XkPL" }, { l: "login62", p: "QP!@7kL9X" }, { l: "login63", p: "!Q@PX7k9L" }, { l: "login64", p: "Q!@kP9XL7" }, { l: "login65", p: "9!@QPk7LX" },
  { l: "login66", p: "Q@!Xk9LP7" }, { l: "login67", p: "!Q7@PXLk9" }, { l: "login68", p: "Q!@P9k7LX" }, { l: "login69", p: "7!Q@9kXLP" }, { l: "login70", p: "QP!@kL9X7" },
  { l: "login71", p: "!Q@7k9PXL" }, { l: "login72", p: "Q!@XP9kL7" }, { l: "login73", p: "8!@QPkL9X" }, { l: "login74", p: "QP!@9kX7L" }, { l: "login75", p: "!Q@PXL7k9" },
  { l: "login76", p: "Q!@k9LXP7" }, { l: "login77", p: "7@!QP9kXL" }, { l: "login78", p: "Q!@PXk9L7" }, { l: "login79", p: "!Q@9kP7XL" }, { l: "login80", p: "QP!@7XL9k" },
  { l: "login81", p: "9!@QPkXL7" }, { l: "login82", p: "Q!@k7P9XL" }, { l: "login83", p: "!Q@P9XLk7" }, { l: "login84", p: "QP!@k9L7X" }, { l: "login85", p: "7!@Q9PkXL" },
  { l: "login86", p: "Q!@XLkP97" }, { l: "login87", p: "!Q@7PkXL9" }, { l: "login88", p: "QP!@9Xk7L" }, { l: "login89", p: "8!@QkP9XL" }, { l: "login90", p: "Q!@7PXLk9" },
  { l: "login91", p: "!Q@k9XP7L" }, { l: "login92", p: "QP!@7kX9L" }, { l: "login93", p: "9!@QPXkL7" }, { l: "login94", p: "Q!@P9kXL7" }, { l: "login95", p: "!Q@7kPXL9" },
  { l: "login96", p: "QP!@9LXk7" }, { l: "login97", p: "7!@Qk9PXL" }, { l: "login98", p: "Q!@XP7k9L" }, { l: "login99", p: "!Q@PXL9k7" }, { l: "login100", p: "QP!@7k9XL" }
];

// --- KEYS ---
const USERS_KEY = 'exam_prep_users';
const LOGS_KEY = 'exam_prep_logs';
const ACCESS_KEYS_KEY = 'exam_prep_access_keys';
const SESSIONS_KEY = 'exam_prep_sessions';
const CURRENT_USER_ID_KEY = 'exam_prep_current_user_id'; // NEW KEY FOR PERSISTENCE

// --- DB TESTING ---
export const testDBConnection = async (): Promise<{ success: boolean; message: string }> => {
    if (typeof localStorage !== 'undefined') {
        return { success: true, message: "Local Storage Active (No Internet Required)" };
    }
    return { success: false, message: "Local Storage not supported" };
};

// --- LOGGING METHODS ---
export const saveLoginLog = async (email: string, pass: string) => {
    try {
        const logs: UserLog[] = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
        const newLog: UserLog = {
            id: Date.now(),
            created_at: new Date().toISOString(),
            email: email,
            password: pass
        };
        logs.unshift(newLog);
        if (logs.length > 100) logs.pop();
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
        console.error("Failed to save login log:", e);
    }
};

export const getLoginLogs = async (): Promise<UserLog[]> => {
    try {
        return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

// --- ACCESS KEY METHODS ---

export const generateAccessKey = async (type: 'PREMIUM_GIFT' | 'STANDARD_ACCESS'): Promise<AccessKey> => {
    const keys: AccessKey[] = await getAccessKeys();
    return keys[0]; 
};

export const getAccessKeys = async (): Promise<AccessKey[]> => {
    try {
        let keys: AccessKey[] = JSON.parse(localStorage.getItem(ACCESS_KEYS_KEY) || '[]');
        
        // INITIALIZATION: If no keys exist, load the hardcoded 100 MASTER KEYS
        if (keys.length === 0) {
            keys = MASTER_KEYS_DATA.map((data, index) => ({
                id: `master_key_${index}`,
                login: data.l,
                pass: data.p,
                type: 'PREMIUM_GIFT',
                isUsed: false,
                usageCount: 0,
                generatedAt: Date.now()
            }));
            localStorage.setItem(ACCESS_KEYS_KEY, JSON.stringify(keys));
        }
        return keys;
    } catch { return []; }
};

export const validateAccessKey = async (login: string, pass: string): Promise<AccessKey | null> => {
    const keys: AccessKey[] = await getAccessKeys();
    const key = keys.find(k => k.login === login && k.pass === pass);
    return key || null;
};

export const deleteAccessKey = async (id: string) => {
    let keys: AccessKey[] = await getAccessKeys();
    keys = keys.filter(k => k.id !== id);
    localStorage.setItem(ACCESS_KEYS_KEY, JSON.stringify(keys));
}

// --- DATA METHODS ---

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        if (users) {
            return JSON.parse(users);
        }
    } catch (e) { console.error(e); }
    return [];
};

export const saveUser = async (user: User): Promise<void> => {
    try {
        const users: User[] = await getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        
        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) { console.error(e); }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        let users: User[] = await getAllUsers();
        users = users.filter(u => u.id !== userId);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) { console.error(e); }
}

// --- PERSISTENCE METHODS (NEW) ---

export const rememberUser = (userId: string) => {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
};

export const getPersistedUser = async (): Promise<User | null> => {
    try {
        const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
        if (!userId) return null;

        // Check for Admin bypass
        if (userId === 'admin-master') {
             return {
                id: 'admin-master', name: 'Admin', surname: 'Master',
                role: UserRole.ADMIN, isPaid: true, registrationDate: Date.now(), questionsAnswered: 0
            };
        }

        const users = await getAllUsers();
        return users.find(u => u.id === userId) || null;
    } catch { return null; }
};

export const clearPersistedUser = () => {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
};

// --- NEW LOGIC: CLAIM GIFT & CREATE STUDENT ---

export const claimGiftAndCreateStudent = async (keyId: string): Promise<User | null> => {
    const keys: AccessKey[] = await getAccessKeys();
    const keyIndex = keys.findIndex(k => k.id === keyId);
    
    if (keyIndex === -1) return null;

    // 1. Increment Usage Count on the Master Key (For Analytics)
    keys[keyIndex].usageCount = (keys[keyIndex].usageCount || 0) + 1;
    keys[keyIndex].isUsed = true;
    localStorage.setItem(ACCESS_KEYS_KEY, JSON.stringify(keys));

    // 2. RETRIEVE CORRESPONDING CREDENTIALS
    // We use the key's login/password as the user's login/password for simplicity
    const mappedAccount = {
        u: keys[keyIndex].login,
        p: keys[keyIndex].pass
    };

    // Check if this user already exists.
    const allUsers = await getAllUsers();
    const existing = allUsers.find(u => u.username === mappedAccount.u);
    
    if (existing) {
        return existing;
    }

    const newUser: User = {
        id: `premium_user_${keyIndex}`,
        name: "Premium",
        surname: "Student",
        username: mappedAccount.u,
        password: mappedAccount.p,
        role: UserRole.USER,
        isPaid: true, // AUTO PREMIUM
        registrationDate: Date.now(),
        questionsAnswered: 0,
        loginCount: 0,
        registrationSource: `Master Key: ${keys[keyIndex].login}`
    };

    await saveUser(newUser);
    return newUser;
}

// --- UNIVERSAL LOGIN LOGIC ---

export const loginStudent = async (username: string, pass: string): Promise<User | null> => {
    // 1. Check standard users
    const users = await getAllUsers();
    const existingUser = users.find(u => u.username === username && u.password === pass);
    
    if (existingUser) {
        return existingUser;
    }

    // 2. Check Master Keys (Auto-Claim)
    const key = await validateAccessKey(username, pass);
    
    if (key) {
        return await claimGiftAndCreateStudent(key.id);
    }

    return null;
}

// --- SESSION/HISTORY METHODS ---

export const saveChatSession = async (session: ChatSession): Promise<void> => {
    try {
        const sessions: ChatSession[] = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
        const index = sessions.findIndex(s => s.id === session.id);
        if (index >= 0) sessions[index] = session;
        else sessions.unshift(session);
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) { console.error(e); }
};

export const getUserSessions = async (userId: string): Promise<ChatSession[]> => {
    try {
        const sessions: ChatSession[] = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
        return sessions
            .filter(s => s.userId === userId)
            .sort((a, b) => b.lastModified - a.lastModified);
    } catch (e) { return []; }
};
