'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/features/auth/context/AuthContext';
import { User, Shield, Bell, Eye, Volume2, Save, Sparkles, Sliders } from 'lucide-react';

export default function CustomerSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'dietary' | 'privacy' | 'notifications' | 'theme'>('profile');

  // Profile fields state
  const [profileName, setProfileName] = useState(user?.name || 'Riya Kapoor');
  const [profileUsername, setProfileUsername] = useState(user?.username || 'riya.eats');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'riya@example.com');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91-9876543210');
  const [profileBio, setProfileBio] = useState('Passionate about premium food presentation, clay-oven tandoors, and micro-aesthetic plating. Let\'s explore Mumbai\'s kitchens!');

  // Dietary settings state
  const [dietType, setDietType] = useState(user?.preferences?.dietFilter || 'veg');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [allergens, setAllergens] = useState<string[]>(['Peanuts']);
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>(['North Indian', 'Italian']);

  // Privacy settings state
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showDineHistory, setShowDineHistory] = useState(true);
  const [allowTableTagging, setAllowTableTagging] = useState(true);

  // Notification settings state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsReceiptEnabled, setSmsReceiptEnabled] = useState(true);
  const [whatsappUpdatesEnabled, setWhatsappUpdatesEnabled] = useState(false);

  // Theme selection state
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'warm'>('warm');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your Plateful foodie profile details were successfully saved.'
    });
  };

  const handleSaveDietary = () => {
    toast({
      type: 'success',
      title: 'Dietary Preferences Saved',
      description: 'Your dining filter details are loaded. Restaurants will warn you for peanuts allergens.'
    });
  };

  const handleSavePrivacy = () => {
    toast({
      type: 'success',
      title: 'Privacy Settings Updated',
      description: 'Dine-in visibility preferences were saved.'
    });
  };

  const handleSaveNotifications = () => {
    toast({
      type: 'success',
      title: 'Notification Settings Saved',
      description: 'Alert parameters registered successfully.'
    });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'warm') => {
    setSelectedTheme(theme);
    toast({
      type: 'info',
      title: 'Theme Preference Registered',
      description: `Interface switched to ${theme.toUpperCase()} mode (simulated).`
    });
  };

  const toggleAllergen = (allergen: string) => {
    setAllergens(prev => 
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setFavoriteCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">User settings</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Customize your food profile, allergy warning triggers, and app UI theme.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSettingsTab('profile')}
          className={`pb-2 border-b-2 text-center flex-shrink-0 px-4 transition-all cursor-pointer ${
            activeSettingsTab === 'profile' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSettingsTab('dietary')}
          className={`pb-2 border-b-2 text-center flex-shrink-0 px-4 transition-all cursor-pointer ${
            activeSettingsTab === 'dietary' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Dietary
        </button>
        <button
          onClick={() => setActiveSettingsTab('privacy')}
          className={`pb-2 border-b-2 text-center flex-shrink-0 px-4 transition-all cursor-pointer ${
            activeSettingsTab === 'privacy' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveSettingsTab('notifications')}
          className={`pb-2 border-b-2 text-center flex-shrink-0 px-4 transition-all cursor-pointer ${
            activeSettingsTab === 'notifications' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Alerts
        </button>
        <button
          onClick={() => setActiveSettingsTab('theme')}
          className={`pb-2 border-b-2 text-center flex-shrink-0 px-4 transition-all cursor-pointer ${
            activeSettingsTab === 'theme' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Theme
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        
        {/* PROFILE TAB */}
        {activeSettingsTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-serif font-bold text-ink">Foodie Profile Details</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  required
                  className="text-xs"
                />
                <Input
                  label="Foodie Username"
                  value={profileUsername}
                  onChange={e => setProfileUsername(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Email Contact"
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  required
                  className="text-xs"
                />
                <Input
                  label="Mobile Contact"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Bio Commentary</label>
                <textarea
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="text-xs min-h-[70px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
                  maxLength={200}
                />
              </div>
            </Card>

            <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>Save Profile Modifications</span>
            </Button>
          </form>
        )}

        {/* DIETARY TAB */}
        {activeSettingsTab === 'dietary' && (
          <div className="space-y-4 text-left">
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
                <Sliders className="w-4 h-4 text-primary" />
                <span className="text-xs font-serif font-bold text-ink">Dietary Filters & Warnings</span>
              </div>

              {/* Diet filter selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Primary Diet Type</label>
                <select
                  value={dietType}
                  onChange={e => setDietType(e.target.value as any)}
                  className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
                >
                  <option value="veg">Vegetarian Only (Green tags)</option>
                  <option value="non-veg">Non-Vegetarian preferred</option>
                  <option value="both">Both cuisines (All items)</option>
                </select>
              </div>

              {/* Spice level tolerance */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Spice Level Tolerance</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Mild', 'Medium', 'Sizzling Hot'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSpiceLevel(level)}
                      className={`py-2 text-xs font-bold border rounded-md transition-all cursor-pointer ${
                        spiceLevel === level
                          ? 'bg-primary text-bg border-primary'
                          : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergens checklists */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Allergen Warning Triggers</label>
                <div className="grid grid-cols-2 gap-2 text-xs text-ink font-semibold">
                  {['Peanuts', 'Gluten', 'Dairy Product', 'Shellfish', 'Soy Lecithin'].map(allergen => {
                    const hasAllergen = allergens.includes(allergen);
                    return (
                      <label key={allergen} className="flex items-center gap-2 cursor-pointer p-1.5 bg-bg-alt/25 rounded border border-line/45 hover:bg-bg-alt/45">
                        <input
                          type="checkbox"
                          checked={hasAllergen}
                          onChange={() => toggleAllergen(allergen)}
                          className="cursor-pointer"
                        />
                        <span>{allergen}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cuisine Preferences */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Favorite Cuisines</label>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {['North Indian', 'Chinese', 'Italian', 'Continental', 'South Indian', 'Mughlai'].map(c => {
                    const isPref = favoriteCuisines.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCuisine(c)}
                        className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          isPref 
                            ? 'bg-secondary text-bg border-secondary' 
                            : 'bg-bg-card border-line text-ink-soft hover:bg-bg-alt'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Button onClick={handleSaveDietary} variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>Save Dietary Profile</span>
            </Button>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeSettingsTab === 'privacy' && (
          <div className="space-y-4 text-left">
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-serif font-bold text-ink">Privacy Configurations</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">Private Account</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Only people you approve can see your food photos, reviews, and dine-in logs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivateAccount}
                    onChange={e => setIsPrivateAccount(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-line/60 pt-3.5">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">Share Dining History</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Allow your approved followers to see your dining visits and table session summaries in their feeds.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showDineHistory}
                    onChange={e => setShowDineHistory(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-line/60 pt-3.5">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">Allow Tableside Tagging</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Allow other diners to tag your profile at tables when scanning group table QR codes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowTableTagging}
                    onChange={e => setAllowTableTagging(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>
              </div>
            </Card>

            <Button onClick={handleSavePrivacy} variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>Save Privacy Settings</span>
            </Button>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeSettingsTab === 'notifications' && (
          <div className="space-y-4 text-left">
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
                <Bell className="w-4 h-4 text-primary" />
                <span className="text-xs font-serif font-bold text-ink">Alert Preferences</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">Mobile Push Alerts</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Receive push notices when followers like your plating post or tag you in a review comments stream.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={e => setPushEnabled(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-line/60 pt-3.5">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">SMS Billing Receipts</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Get instant transactional SMS receipts with GST summaries right after table bills are settled by cashier.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsReceiptEnabled}
                    onChange={e => setSmsReceiptEnabled(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-line/60 pt-3.5">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-bold text-ink block">WhatsApp Updates</span>
                    <p className="text-[10px] text-ink-soft leading-normal">Subscribe to restaurant table reservations and waiting queue alerts directly on WhatsApp.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappUpdatesEnabled}
                    onChange={e => setWhatsappUpdatesEnabled(e.target.checked)}
                    className="cursor-pointer mt-1"
                  />
                </div>
              </div>
            </Card>

            <Button onClick={handleSaveNotifications} variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>Save Alert Preferences</span>
            </Button>
          </div>
        )}

        {/* THEME TAB */}
        {activeSettingsTab === 'theme' && (
          <div className="space-y-4 text-left">
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-serif font-bold text-ink">Visual Themes</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Light mode */}
                <div 
                  onClick={() => handleThemeChange('light')}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between h-24 ${
                    selectedTheme === 'light' ? 'border-primary ring-2 ring-primary-soft bg-white' : 'border-line bg-stone-50'
                  }`}
                >
                  <span className="text-[10px] font-bold text-ink block leading-none">Light Mode</span>
                  <div className="space-y-1 mt-3">
                    <div className="w-full h-1 bg-stone-200 rounded" />
                    <div className="w-2/3 h-1 bg-stone-300 rounded" />
                  </div>
                </div>

                {/* Dark mode */}
                <div 
                  onClick={() => handleThemeChange('dark')}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between h-24 text-white ${
                    selectedTheme === 'dark' ? 'border-primary ring-2 ring-primary-soft bg-stone-900' : 'border-line bg-stone-950'
                  }`}
                >
                  <span className="text-[10px] font-bold text-white block leading-none">Dark Mode</span>
                  <div className="space-y-1 mt-3">
                    <div className="w-full h-1 bg-stone-700 rounded" />
                    <div className="w-2/3 h-1 bg-stone-800 rounded" />
                  </div>
                </div>

                {/* Warm mode */}
                <div 
                  onClick={() => handleThemeChange('warm')}
                  className={`border rounded-xl p-3 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between h-24 ${
                    selectedTheme === 'warm' ? 'border-primary ring-2 ring-primary-soft bg-[#FAF7F2]' : 'border-line bg-[#FAF7F2]/80'
                  }`}
                >
                  <span className="text-[10px] font-bold text-ink block leading-none">Plateful Warm</span>
                  <div className="space-y-1 mt-3">
                    <div className="w-full h-1 bg-[#F1EAE0] rounded" />
                    <div className="w-2/3 h-1 bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
