// @desc    Get current logged in user profile (verified via Supabase token)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware after verifying token & database lookup
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user info',
      error: error.message,
    });
  }
};
