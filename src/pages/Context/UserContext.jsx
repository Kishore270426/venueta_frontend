import { createContext, useState, useEffect } from "react";

export const  UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    userName: null,
    userAccessToken: null,
    user_email:null,
  });

  useEffect(() => {
    // Load user details from localStorage on initial load
    const storedUserId = localStorage.getItem("user_id");
    const storedUserName = localStorage.getItem("user_name");
    const storedAccessToken = localStorage.getItem("user_access_token");
    const storedUserEmail = localStorage.getItem("user_email");

    if (storedUserId && storedUserName && storedAccessToken) {
      setUser({
        userId: storedUserId,
        userName: storedUserName,
        userAccessToken: storedAccessToken,
        user_email:storedUserEmail
      });
    }
  }, []);

  // ✅ Login function
  const loginUser = (userName, accessToken, userId,user_email) => {
    // Save to state
    setUser({ userId, userName, userAccessToken: accessToken ,user_email});

    // Save to localStorage
    localStorage.setItem("user_id", userId);
    localStorage.setItem("user_name", userName);
    localStorage.setItem("user_email", user_email);
    localStorage.setItem("user_access_token", accessToken);
  };

  // ✅ Logout function
  const logoutUser = () => {
    // Clear state
    setUser({ userId: null, userName: null, userAccessToken: null,user_email:null });

    // Remove from localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_email");
  };

  // ✅ Update user info function
  const updateUser = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));

    // Update localStorage
    if (newUserData.userId) localStorage.setItem("user_id", newUserData.userId);
    if (newUserData.userName) localStorage.setItem("user_name", newUserData.userName);
    if (newUserData.userAccessToken) localStorage.setItem("user_access_token", newUserData.userAccessToken);
    if (newUserData.user_email) localStorage.setItem("user_email", newUserData.userAccessToken);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};





