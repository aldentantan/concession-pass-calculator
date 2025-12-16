import { createContext, useState, useContext, useEffect } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

interface AuthContextType {
    session: Session | null;
    user: User | null;
    access_token: string | null;
    loading: boolean;
    isRecoverySession: boolean; // User is assigned a temp recovery session when resetting password
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);
    const [isRecoverySession, setIsRecoverySession] = useState(false);

    useEffect(() => {
        const checkRecoverySession = () => {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const type = params.get('type');
            const errorCode = params.get('error_code');

            // Check if this is a recovery session (not expired)
            if (type === 'recovery' && errorCode !== 'otp_expired') {
                console.log('Recovery session detected from URL');
                return true;
            }
            return false;
        };
        setIsRecoverySession(checkRecoverySession());

        // Get initial session (check if user is already logged in)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);

            if (_event === 'PASSWORD_RECOVERY') {
                setIsRecoverySession(true);
            } else {
                setIsRecoverySession(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsRecoverySession(false);
        setSession(null);
    };

    return <AuthContext.Provider value={{
        session,
        user: session?.user ?? null,
        access_token: session?.access_token ?? null,
        loading,
        isRecoverySession,
        signOut
    }}
    >
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}