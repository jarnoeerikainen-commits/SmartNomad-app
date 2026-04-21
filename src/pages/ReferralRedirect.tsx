import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AffiliateService } from '@/services/AffiliateService';

/**
 * /r/:code — captures the referral click server-side and bounces
 * the visitor to the home page (or wherever ?to= says).
 */
const ReferralRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const go = async () => {
      if (code) {
        try {
          const click_id = await AffiliateService.trackClick(code.toUpperCase());
          if (click_id) {
            localStorage.setItem('sn_ref', JSON.stringify({
              code: code.toUpperCase(), click_id, t: Date.now(),
            }));
          }
        } catch (e) {
          console.warn('[referral] track failed', e);
        }
      }
      const to = new URLSearchParams(window.location.search).get('to') || '/';
      navigate(to, { replace: true });
    };
    go();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Welcome to SuperNomad…</p>
      </div>
    </div>
  );
};

export default ReferralRedirect;
