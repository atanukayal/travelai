import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Share2, QrCode, Copy, Check, 
  UserPlus, Mail, MessageCircle 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import QRCode from 'qrcode';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'pending' | 'joined';
}

interface GroupPlannerProps {
  tripId: string;
  destination: string;
}

const GroupPlanner: React.FC<GroupPlannerProps> = ({ tripId, destination }) => {
  const { isDark } = useTheme();
  const [members, setMembers] = useState<GroupMember[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'joined' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [shareLink] = useState(`https://smarttrip.app/join/${tripId}`);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate QR Code
  React.useEffect(() => {
    QRCode.toDataURL(shareLink, {
      width: 200,
      margin: 2,
      color: {
        dark: isDark ? '#FFFFFF' : '#000000',
        light: isDark ? '#1F2937' : '#FFFFFF'
      }
    }).then(setQrCodeUrl);
  }, [shareLink, isDark]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim()) {
      const newMember: GroupMember = {
        id: Date.now().toString(),
        name: newEmail.split('@')[0],
        email: newEmail,
        status: 'pending'
      };
      setMembers([...members, newMember]);
      setNewEmail('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my ${destination} trip!`,
          text: `I'm planning an amazing trip to ${destination}. Join me!`,
          url: shareLink
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-lg border ${
        isDark 
          ? 'bg-slate-800/80 border-slate-600' 
          : 'bg-white/80 border-gray-200'
      } shadow-lg`}
    >
      <div className="text-center mb-8">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          <Users className="inline h-6 w-6 mr-2" />
          Group Planning
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          Collaborate with friends and family on your {destination} trip
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Share & Invite Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Share Link */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Share Trip Link
            </h4>
            <div className={`flex items-center p-3 rounded-xl border ${
              isDark 
                ? 'bg-slate-700/50 border-slate-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <input
                type="text"
                value={shareLink}
                readOnly
                className={`flex-1 bg-transparent text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                } focus:outline-none`}
              />
              <motion.button
                onClick={handleCopyLink}
                className={`ml-2 p-2 rounded-lg transition-colors ${
                  copied
                    ? (isDark ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (isDark ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600')
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </motion.button>
            </div>
            
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={handleShare}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="h-4 w-4 mr-2 inline" />
                Share
              </motion.button>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h4 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              QR Code
            </h4>
            {qrCodeUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`inline-block p-4 rounded-xl ${
                  isDark ? 'bg-white' : 'bg-gray-100'
                }`}
              >
                <img src={qrCodeUrl} alt="Trip QR Code" className="w-32 h-32" />
              </motion.div>
            )}
            <p className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Scan to join the trip
            </p>
          </div>

          {/* Email Invite */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Invite by Email
            </h4>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              <motion.button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Members List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Trip Members ({members.length})
          </h4>
          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-slate-600' : 'bg-gray-200'
                  }`}>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-700'
                    }`}>
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {member.name}
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {member.email}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'joined'
                    ? (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : (isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                }`}>
                  {member.status === 'joined' ? '✓ Joined' : '⏳ Pending'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Group Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <motion.button
              className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                isDark 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="h-4 w-4 mr-2 inline" />
              Open Group Chat
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GroupPlanner;