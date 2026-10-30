import { User, AuthCredentials, SignUpData } from '../types';
import { INITIAL_USER } from './mockData';
import { hashPassword } from './crypto';

const AUTH_KEYS = {
  ACCOUNTS: 'ecoquest_auth_accounts',
  SESSION: 'ecoquest_auth_session',
  PENDING_REGISTRATION: 'ecoquest_pending_reg'
};

// Known demo account hash for password123
// SHA-256('password123:ecoquest_salt_v1')
const DEMO_PASSWORD_HASH = 'b3b6257fe5213dc611028368b2fc56475c57e5a3d62aa38505f904bec1d9d07a';

const DEFAULT_ACCOUNTS: User[] = [
  {
    ...INITIAL_USER,
    email: 'aarav@ecoquest.org',
    phone: '+91 98765 43210',
    passwordHash: DEMO_PASSWORD_HASH,
    isVerified: true,
    verificationMethod: 'email',
    city: 'Hyderabad',
    college: 'IIT Hyderabad'
  }
];

function getStoredAccounts(): User[] {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const accounts = JSON.parse(raw);
    // Sanitize any legacy accounts that had plaintext passwords
    let updated = false;
    const sanitized = accounts.map((a: any) => {
      if ((a.email || '').toLowerCase() === 'aarav@ecoquest.org') {
        if (a.passwordHash !== DEMO_PASSWORD_HASH) {
          a.passwordHash = DEMO_PASSWORD_HASH;
          updated = true;
        }
      }
      if (a.password && !a.passwordHash) {
        a.passwordHash = DEMO_PASSWORD_HASH;
        delete a.password;
        updated = true;
      }
      return a;
    });
    if (updated) {
      localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts: User[]): void {
  try {
    // Strip any unexpected sensitive keys before saving
    const safeAccounts = accounts.map(a => {
      const copy: any = { ...a };
      delete copy.password;
      return copy;
    });
    localStorage.setItem(AUTH_KEYS.ACCOUNTS, JSON.stringify(safeAccounts));
  } catch (err) {
    console.warn('Failed to save accounts to localStorage:', err);
  }
}

export interface DemoOtpSession {
  code: string;
  target: string;
  method: 'email' | 'phone';
  expiresAt: number; // timestamp in ms (5 min validity)
  signupData: SignUpData;
  passwordHash: string;
}

export const AuthService = {
  getAccounts(): User[] {
    return getStoredAccounts();
  },

  getCurrentSession(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_KEYS.SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setSession(user: User | null): void {
    try {
      if (user) {
        const safeUser: any = { ...user };
        delete safeUser.password;
        delete safeUser.passwordHash;
        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(safeUser));
      } else {
        localStorage.removeItem(AUTH_KEYS.SESSION);
      }
    } catch (err) {
      console.warn('Failed to update session in localStorage:', err);
    }
  },

  checkDuplicate(email: string, phone?: string): { duplicate: boolean; field?: 'email' | 'phone' } {
    const accounts = getStoredAccounts();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim().replace(/\s+/g, '') || '';

    const emailExists = accounts.some(a => (a.email || '').toLowerCase() === cleanEmail);
    if (emailExists) return { duplicate: true, field: 'email' };

    if (cleanPhone) {
      const phoneExists = accounts.some(
        a => (a.phone || '').trim().replace(/\s+/g, '') === cleanPhone
      );
      if (phoneExists) return { duplicate: true, field: 'phone' };
    }

    return { duplicate: false };
  },

  /**
   * Initiates registration with simulated OTP generation.
   * Does NOT activate account until OTP verification passes.
   */
  async startRegistration(data: SignUpData): Promise<DemoOtpSession> {
    await new Promise(r => setTimeout(r, 400));

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      throw new Error('Please enter a valid email address.');
    }

    // Validate phone if phone method selected
    if (data.verificationMethod === 'phone' && (!data.phone || data.phone.trim().length < 8)) {
      throw new Error('Please enter a valid phone number for SMS verification.');
    }

    // Check duplicate
    const check = this.checkDuplicate(data.email, data.phone);
    if (check.duplicate) {
      throw new Error(
        check.field === 'email'
          ? 'An account with this email address already exists. Please log in.'
          : 'An account with this phone number already exists.'
      );
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    // Hash password immediately — never hold or save plaintext
    const pHash = await hashPassword(data.password);

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const target = data.verificationMethod === 'phone' ? data.phone.trim() : data.email.trim();

    return {
      code,
      target,
      method: data.verificationMethod,
      expiresAt,
      signupData: data,
      passwordHash: pHash
    };
  },

  /**
   * Completes registration when correct OTP is provided.
   */
  async verifyAndCreateAccount(session: DemoOtpSession, enteredOtp: string): Promise<User> {
    await new Promise(r => setTimeout(r, 350));

    if (Date.now() > session.expiresAt) {
      throw new Error('This verification code has expired. Please request a new code.');
    }

    if (enteredOtp.trim() !== session.code.trim()) {
      throw new Error('Incorrect verification code. Please check and try again.');
    }

    const { signupData, passwordHash } = session;

    // Default avatar if none provided
    const avatar =
      signupData.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

    const newUser: User = {
      id: 'u-' + Date.now(),
      name: signupData.name.trim(),
      email: signupData.email.trim().toLowerCase(),
      phone: signupData.phone.trim(),
      passwordHash,
      isVerified: true,
      verificationMethod: session.method,
      city: signupData.city.trim() || 'Hyderabad',
      college: signupData.college.trim() || 'Student Community',
      avatar,
      level: 1,
      levelTitle: 'Eco Novice',
      xp: 50, // Starter welcome reward
      streak: 1,
      missionsCompleted: 0,
      learningCompleted: 0,
      wasteCollectedKg: 0,
      treesPlanted: 0,
      volunteerHours: 0,
      completedMissionIds: [],
      badges: [
        {
          id: 'b-welcome',
          title: 'Eco Explorer',
          description: 'Joined the EcoQuest movement and pledged verified real action',
          icon: '🌱',
          isUnlocked: true,
          unlockedAt: new Date().toISOString().split('T')[0],
          progress: 100
        }
      ]
    };

    const accounts = getStoredAccounts();
    const updated = [newUser, ...accounts];
    saveStoredAccounts(updated);

    this.setSession(newUser);
    return newUser;
  },

  async login(credentials: AuthCredentials): Promise<User> {
    await new Promise(res => setTimeout(res, 400));

    const identifier = credentials.emailOrPhone.trim().toLowerCase();
    const accounts = getStoredAccounts();

    // Match by email or clean phone
    const cleanPhone = credentials.emailOrPhone.trim().replace(/\s+/g, '');
    const account = accounts.find(
      a =>
        (a.email || '').toLowerCase() === identifier ||
        (a.phone || '').trim().replace(/\s+/g, '') === cleanPhone
    );

    if (!account) {
      throw new Error('No account found with this email or phone number. Please check or sign up.');
    }

    if (!account.isVerified) {
      throw new Error('This account has not completed verification yet.');
    }

    // Compare SHA-256 hashed password
    const enteredHash = await hashPassword(credentials.password);
    if (account.passwordHash && account.passwordHash !== enteredHash) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    this.setSession(account);
    return account;
  },

  logout(): void {
    this.setSession(null);
  },

  updateUser(user: User): void {
    const accounts = getStoredAccounts();
    const updated = accounts.map(a => (a.id === user.id ? { ...a, ...user } : a));
    saveStoredAccounts(updated);
    const session = this.getCurrentSession();
    if (session && session.id === user.id) {
      this.setSession({ ...session, ...user });
    }
  }
};
