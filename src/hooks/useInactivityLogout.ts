import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INACTIVITY_TIMEOUT = 3* 60 * 1000; // 3 minute en millisecondes

export const useInactivityLogout = () => {
   const { signOut } = useAuth();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();

  useEffect(() => {
    if (!signIn) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        console.log('Inactivité détectée - déconnexion...');
        // Déconnexion après l'expiration du délai d'inactivité
        signOut();
        navigate(`/admin/auth/signin`);
      }, INACTIVITY_TIMEOUT);
    };

    // Réinitialiser le timer lors d'événements utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Démarrer le timer initial
    resetTimer();

    // Nettoyage
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [signIn, signOut, navigate, lng]);
};
