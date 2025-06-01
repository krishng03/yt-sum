import React, { useState } from 'react';
import { IconUser, IconLock, IconArrowLeft, IconBrandYoutube } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthProps {
    onBackToLanding: () => void;
    onLoginSuccess: (user: { userid: number; username: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onBackToLanding, onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Login form state
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // Signup form state
    const [signupData, setSignupData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Login successful!');
                onLoginSuccess(data.user);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: signupData.username,
                    password: signupData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully! Please login.');
                setSignupData({ username: '', password: '', confirmPassword: '' });
                // Auto-switch to login tab after successful signup
                setTimeout(() => {
                    const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                    loginTab?.click();
                }, 1000);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-red-50">
            <div className="container mx-auto px-4 pt-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={onBackToLanding}
                        variant="ghost"
                        className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>

                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-red-500">
                            <IconBrandYoutube className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-br from-pink-500 to-red-500 bg-clip-text text-transparent">YouTube Summarizer</h1>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="flex justify-center items-center mb-4">
                    <div className="w-full max-w-md">
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 px-8 pt-6 pb-2">
                            <div className="text-center mb-8">
                                <div className="p-4 rounded-full bg-gradient-to-br from-pink-500 to-red-500 w-fit mx-auto mb-4">
                                    <IconUser className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
                                <p className="text-gray-600">Login or create an account to save your summaries</p>
                            </div>

                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="grid w-full grid-cols-2  h-fit bg-white/70 backdrop-blur-sm border border-pink-100 rounded-2xl p-2 mb-2">
                                    <TabsTrigger
                                        value="login"
                                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-orange-200 data-[state=active]:text-gray-800 py-2 cursor-pointer"
                                    >
                                        Login
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="signup"
                                        className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-200 data-[state=active]:to-orange-200 data-[state=active]:text-gray-800 py-2 cursor-pointer"
                                    >
                                        Sign Up
                                    </TabsTrigger>
                                </TabsList>

                                {/* Error/Success Messages */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                                        {success}
                                    </div>
                                )}

                                <TabsContent value="login">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="mb-1">
                                                <label className="text-sm font-medium text-gray-700">Username</label>
                                            </div>
                                            <div className="relative">
                                                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your username"
                                                    value={loginData.username}
                                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                                    className="pl-10 rounded-lg border-pink-200 focus:border-none focus:border-0 focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="mb-1">
                                                <label className="text-sm font-medium text-gray-700">Password</label>
                                            </div>
                                            <div className="relative">
                                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                    className="pl-10 rounded-lg border-pink-200 focus:border-none focus:border-0 focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full cursor-pointer py-3 text-white font-semibold bg-gradient-to-br from-pink-500 to-red-500 hover:opacity-90 transition-opacity rounded-lg"
                                        >
                                            {isLoading ? 'Logging in...' : 'Login'}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup">
                                    <form onSubmit={handleSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="mb-1">
                                                <label className="text-sm font-medium text-gray-700">Username</label>
                                            </div>
                                            <div className="relative">
                                                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Choose a username"
                                                    value={signupData.username}
                                                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                                    className="pl-10 rounded-lg border-pink-200 focus:border-pink-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="mb-1">
                                                <label className="text-sm font-medium text-gray-700">Password</label>
                                            </div>
                                            <div className="relative">
                                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="password"
                                                    placeholder="Create a password"
                                                    value={signupData.password}
                                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                    className="pl-10 rounded-lg border-pink-200 focus:border-pink-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="mb-1">
                                                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                            </div>
                                            <div className="relative">
                                                <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    type="password"
                                                    placeholder="Confirm your password"
                                                    value={signupData.confirmPassword}
                                                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                                    className="pl-10 rounded-lg border-pink-200 focus:border-pink-400"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full cursor-pointer py-3 text-white font-semibold bg-gradient-to-br from-pink-500 to-red-500 hover:opacity-90 transition-opacity rounded-lg"
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center">
                                <Button
                                    variant="ghost"
                                    onClick={() => onLoginSuccess({ userid: 0, username: 'Guest' })}
                                    className="mt-1 text-pink-600 hover:text-pink-700 cursor-pointer"
                                >
                                    Continue as Guest
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth; 