import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  if (isLogin) {
    return <LoginScreen onSwitchToSignup={switchToSignup} />;
  } else {
    return <SignupScreen onSwitchToLogin={switchToLogin} />;
  }
}
