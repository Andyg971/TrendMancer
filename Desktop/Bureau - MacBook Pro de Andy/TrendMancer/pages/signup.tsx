import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ChevronLeft } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const SignupPage = () => {
  const router = useRouter();
  const { plan } = router.query;
  
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions générales pour continuer.');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            subscription_tier: plan || 'free',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        if (plan && plan !== 'free') {
          router.push(`/checkout?plan=${plan}`);
        } else {
          router.push('/dashboard');
        }
      } else {
        setStep(3); // Success message with email verification required
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!fullName || !email)) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom complet
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Adresse e-mail
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="vous@exemple.com"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continuer
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmer le mot de passe
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            J'accepte les{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              conditions générales
            </a>
            {' '}et la{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              politique de confidentialité
            </a>
          </label>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </button>
        <button
          type="submit"
          disabled={loading || !acceptTerms}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Inscription en cours...' : 'Créer mon compte'}
        </button>
      </div>
    </>
  );

  const renderVerificationStep = () => (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
        <svg className="h-6 w-6 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mt-3 text-xl font-medium text-gray-900 dark:text-white">Vérifiez votre boîte mail</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Nous avons envoyé un email à <span className="font-medium text-gray-900 dark:text-white">{email}</span>.
        <br />Veuillez cliquer sur le lien de vérification pour activer votre compte.
      </p>
      <div className="mt-6">
        <Link href="/login" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Aller à la page de connexion
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            TM
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {step === 3 ? 'Inscription réussie' : 'Créez votre compte'}
        </h2>
        {step !== 3 && (
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              connectez-vous à votre compte existant
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {step !== 3 ? (
            <form className="space-y-6" onSubmit={handleSignup}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
            </form>
          ) : (
            renderVerificationStep()
          )}

          {step !== 3 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Ou continuez avec
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 12.151L12.545 12.151L12.545 12.151V12.151L12.545 12.151L12.545 12.151V12.151L12.545 12.151V12.151L12.545 12.151L12.545 12.151L12.545 12.151L20.286 12.151C20.286 11.617 20.25 11.095 20.179 10.584C20.179 10.584 20.176 10.57 20.171 10.548H20.18L20.171 10.548C19.885 8.417 19.013 6.419 17.6 4.9L17.6 4.9L17.6 4.9C16.195 3.389 14.39 2.326 12.353 1.869C10.315 1.411 8.207 1.577 6.261 2.343C4.315 3.109 2.649 4.441 1.51 6.176C0.371 7.91 -0.177 9.957 -0.061 12.017C0.08 14.544 1.213 16.903 3.145 18.566C5.077 20.229 7.636 21.028 10.163 20.771C12.553 20.53 14.787 19.422 16.412 17.628L16.412 17.628L16.412 17.628C16.415 17.626 16.419 17.622 16.422 17.619L16.422 17.619L16.422 17.619C16.942 17.075 17.406 16.478 17.808 15.837L17.809 15.836C18.071 15.415 18.307 14.977 18.516 14.526L18.516 14.526L18.516 14.526C18.599 14.336 18.676 14.144 18.748 13.949C18.811 13.779 18.864 13.624 18.909 13.483C18.937 13.397 18.961 13.318 18.981 13.244C19.001 13.172 19.013 13.122 19.019 13.097C19.025 13.073 19.027 13.061 19.027 13.061C19.134 12.613 19.188 12.151 19.188 11.685C19.188 11.335 19.159 10.987 19.1 10.643H12.538V14.491H16.479C16.411 14.783 16.316 15.068 16.196 15.344C16.024 15.73 15.823 16.049 15.592 16.302C15.308 16.611 14.979 16.871 14.618 17.073C14.258 17.274 13.87 17.415 13.469 17.49C13.069 17.565 12.661 17.572 12.258 17.512C11.857 17.452 11.465 17.325 11.099 17.136C10.732 16.948 10.397 16.7 10.105 16.404C9.89 16.186 9.696 15.944 9.526 15.684C9.173 15.139 8.949 14.521 8.874 13.876C8.798 13.232 8.873 12.578 9.092 11.97C9.234 11.563 9.44 11.186 9.7 10.855C9.96 10.524 10.269 10.244 10.616 10.028C11.058 9.747 11.566 9.584 12.087 9.554C12.609 9.524 13.13 9.627 13.604 9.855C13.969 10.025 14.3 10.27 14.574 10.576C14.849 10.881 15.063 11.24 15.203 11.63L18.303 9.184C17.918 8.489 17.403 7.882 16.79 7.395C15.54 6.427 13.977 5.927 12.389 5.987C10.801 6.046 9.278 6.66 8.11 7.721C6.942 8.782 6.2 10.216 6.013 11.766C5.826 13.316 6.208 14.877 7.09 16.142C7.455 16.667 7.909 17.127 8.433 17.507C8.958 17.887 9.544 18.18 10.167 18.375C10.792 18.57 11.445 18.665 12.1 18.654C12.754 18.644 13.404 18.529 14.024 18.315C14.626 18.107 15.192 17.804 15.706 17.416C16.219 17.029 16.671 16.563 17.044 16.034C17.416 15.504 17.704 14.92 17.897 14.301C18.091 13.683 18.188 13.039 18.183 12.391C18.183 12.299 18.182 12.207 18.179 12.112L18.18 12.151H12.542L12.545 12.151Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <div>
                  <Link href="/login" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Se connecter
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 