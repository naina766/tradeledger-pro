import React, { useContext, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card from '../components/Common/Card';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, ShieldAlert, Key, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Name and email cannot be blank.');
    }

    setInfoSubmitting(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      updateProfile(res.data.data.user);
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setInfoSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return toast.error('Please enter all password fields.');
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters.');
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error('Confirm password does not match.');
    }

    setPassSubmitting(true);
    try {
      await api.put('/auth/profile/password', {
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed.');
    } finally {
      setPassSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Account Settings">
      
      {/* Profile Overview Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-2">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-3xl border-2 border-indigo-400 select-none uppercase">
            {user?.name?.substring(0, 2)}
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-xl font-bold text-white">{user?.name}</h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-slate-600" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <ShieldAlert className="w-4 h-4 text-slate-600" />
                {user?.role} Role
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-600" />
                Joined {new Date(user?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <Card title="Update Profile Details">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={infoSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20"
            >
              {infoSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </Card>

        {/* Change Password */}
        <Card title="Update Password Security">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20"
            >
              {passSubmitting ? 'Updating Password...' : 'Save Password'}
            </button>
          </form>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
