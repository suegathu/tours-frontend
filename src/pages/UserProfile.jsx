import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    phone_number: '',
    profile_picture: null,
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfileData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/profile/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          });
      
          console.log("Fetched Profile Data:", response.data); // Log the data
      
          // Assuming the data is in the correct format
          if (response.data.profile) {
            setProfile(response.data.profile);
            setFormData({
              bio: response.data.profile.bio || '',
              phone_number: response.data.profile.phone_number || '',
              profile_picture: response.data.profile.profile_picture || '',
            });
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      

    fetchProfileData();
  }, []);

  // Handle input changes for the edit form
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  // Submit edited profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('phone_number', formData.phone_number);
    if (formData.profile_picture) {
      formDataToSend.append('profile_picture', formData.profile_picture);
    }
  
    try {
      // Ensure the request points to the correct backend URL (e.g., localhost:8000)
      await axios.put('http://localhost:8000/profile/', formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEditMode(false); // Disable edit mode after submitting
      // Optionally, refetch the data to reflect changes
      const updatedProfileResponse = await axios.get('http://localhost:8000/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(updatedProfileResponse.data.profile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{profile.username}'s Profile</h2>
        <button onClick={toggleEditMode}>
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="profile-details">
        <img src={profile.profile_picture || 'default-avatar.png'} alt="Profile" className="profile-avatar" />
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Profile Picture:</label>
              <input
                type="file"
                name="profile_picture"
                onChange={handleChange}
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        ) : (
          <div>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Phone Number:</strong> {profile.phone_number}</p>
          </div>
        )}
      </div>
      
      <div className="profile-activities">
        <h3>Your Activities</h3>
        
      </div>
    </div>
  );
};

export default UserProfile;
