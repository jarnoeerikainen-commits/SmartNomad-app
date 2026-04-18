import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMFA } from '@/hooks/useMFA';
import MFAChallenge from '@/components/auth/MFAChallenge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Globe, Shield, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
  const { isAuthenticated, isLoading, signIn, signUp, resetPassword } = useAuth();
  const { mfaChallengeRequired, hasVerifiedFactor } = useMFA();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If signed in but MFA challenge is pending (aal1 → aal2), block until verified.
  if (isAuthenticated && mfaChallengeRequired && hasVerifiedFactor) {
    return <MFAChallenge onSuccess={() => window.location.replace('/')} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Minimum 6 characters required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupFirstName, signupLastName);
    setLoading(false);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: 'Account created!',
        description: 'Check your email to verify your account, then log in.',
      });
      setActiveTab('login');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(forgotEmail);
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Reset link sent', description: 'Check your email for a password reset link.' });
      setShowForgot(false);
    }
  };

  const handleDemoAccess = () => {
    // Navigate to home without auth — device_id mode
    window.location.href = '/';
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
        <Card className="w-full max-w-md shadow-xl border-border/50">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto flex items-center gap-2">
              <img src="/lovable-uploads/supernomad-logo.jpg" alt="SuperNomad" className="h-10 w-10 rounded-xl" />
              <CardTitle className="text-2xl font-display">Reset Password</CardTitle>
            </div>
            <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgot(false)}>
                Back to login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 0%, transparent 50%)'
        }} />
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/supernomad-logo.jpg" alt="SuperNomad" className="h-16 w-16 rounded-2xl shadow-lg" />
            <div>
              <h1 className="text-4xl font-bold font-display">
                <span className="text-foreground">Super</span>
                <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold-dark)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nomad</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">Your Global Concierge</p>
            </div>
          </div>

          <div className="space-y-6">
            <FeatureHighlight icon={<Globe className="h-5 w-5 text-primary" />} title="195+ Countries" desc="Tax tracking, visa management, and residency intelligence" />
            <FeatureHighlight icon={<Shield className="h-5 w-5 text-primary" />} title="Black Box Guardian" desc="Military-grade personal safety with encrypted evidence chain" />
            <FeatureHighlight icon={<Zap className="h-5 w-5 text-primary" />} title="8 AI Specialists" desc="Legal, medical, travel, financial — your concierge team" />
          </div>
        </div>
      </div>

      {/* Right — Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <img src="/lovable-uploads/supernomad-logo.jpg" alt="SuperNomad" className="h-12 w-12 rounded-xl shadow-md" />
            <div>
              <h1 className="text-2xl font-bold font-display">
                <span className="text-foreground">Super</span>
                <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dark)), hsl(var(--gold-light)), hsl(var(--gold-dark)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nomad</span>
              </h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your SuperNomad account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <button type="button" className="text-sm text-primary hover:underline w-full text-center" onClick={() => setShowForgot(true)}>
                      Forgot your password?
                    </button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>Join SuperNomad — your global life, organized</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-first">First name</Label>
                        <Input id="signup-first" placeholder="John" value={signupFirstName} onChange={(e) => setSignupFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-last">Last name</Label>
                        <Input id="signup-last" placeholder="Doe" value={signupLastName} onChange={(e) => setSignupLastName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required minLength={6} />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By signing up, you agree to our{' '}
                      <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
                      <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Demo Access */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full group" onClick={handleDemoAccess}>
            <span>Continue as Guest</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Explore with demo profiles — no account needed
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureHighlight: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

export default Auth;
