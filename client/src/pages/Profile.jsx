import { useState,useRef,useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/AuthContext';
import { Camera, UserRound, Mail,X,Check } from 'lucide-react';
import { uploadProfilePic } from '../api/usersApi';


const Profile = () => {

  const { user,updatedUser } = useAuth();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setError('Please select a valid image');
        return;
    }

    setError('');
    setSuccess('');

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('profilePic', selectedFile);

        const response = await uploadProfilePic(formData);

        updatedUser({
            profilePic: response.data.profilePic
        });

        setSelectedFile(null);
        setPreview('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setSuccess('Profile picture updated successfully');

    } catch (error) {
        setError(
            error.response?.data?.message ||
            'Failed to upload profile picture'
        );
    } finally {
        setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview('');
    setError('');

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-secondary)]">
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="h-[72px] bg-white flex items-center px-8 border-b border-[var(--color-border)]">
            <h1 className="text-xl font-semibold text-[var(--color-text)]">
              My Profile
            </h1>
          </div>

          {/* Profile Content */}
          <div className="p-8 max-w-5xl mx-auto">

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 md:p-10">

              <div className="flex flex-col items-center text-center">

                {/* Profile Picture */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-[var(--color-secondary)] border-4 border-white shadow-lg ring-1 ring-[var(--color-border)]">

                  {preview || user?.profilePic ? (
                     <img
                        src={
                            preview ||
                            `http://localhost:3000${user.profilePic}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserRound className="w-full h-full p-9 text-[var(--color-muted)]" />
                  )}

                </div>

                {/* User Details */}
                <h2 className="text-2xl font-bold text-[var(--color-text)] mt-6">
                  {user?.fullname}
                </h2>

                <p className="text-[var(--color-muted)] mt-2">
                  {user?.email}
                </p>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={loading}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-sidebar-hover)] transition-colors shadow-sm"
                >
                  <Camera size={17} />
                  Change Photo
                </button>
                
                {/* Save and Cancel Buttons */}
                {selectedFile && (
                    <div className="flex items-center gap-3 mt-4">

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-success)] text-white disabled:opacity-50"
                        >
                            <Check size={17} />
                            {loading ? 'Uploading...' : 'Save Photo'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] disabled:opacity-50"
                        >
                            <X size={17} />
                            Cancel
                        </button>

                    </div>
                )}

                 {/* Error and Success Messages */}
                {error && (
                  <p className="text-sm text-[var(--color-danger)] mt-4">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="text-sm text-[var(--color-success)] mt-4">
                    {success}
                  </p>
                )}


              </div>

              {/* Personal Information */}
              <div className="mt-12 border-t border-[var(--color-border)] pt-8">

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    Personal Information
                  </h3>

                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    Your account details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div className="p-5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <UserRound size={18} className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-muted)]">
                        Full Name
                      </label>
                    </div>

                    <p className="text-[var(--color-text)] font-semibold">
                      {user?.fullname}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="p-5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail size={18} className="text-[var(--color-accent)]" />
                      <label className="text-sm font-medium text-[var(--color-muted)]">
                        Email Address
                      </label>
                    </div>

                    <p className="text-[var(--color-text)] font-semibold break-all">
                      {user?.email}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
