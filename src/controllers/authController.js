const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, roleId, institutionId } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      roleId,
      institutionId
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate('roleId');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check account status
    if (user.accountStatus === 'Suspended') {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Setup JWT Payload
    const payload = {
      user: {
        id: user._id,
        role: user.roleId ? user.roleId.name : null,
        institutionId: user.institutionId
      }
    };

    // Sign Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      async (err, token) => {
        if (err) throw err;
        
        // Update last log in
        user.lastLogin = new Date();
        await user.save();

        res.json({ token, role: payload.user.role });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.forgotPassword = async (req, res) => {
  res.json({ message: 'Forgot password email sent logic would go here' });
};

exports.resetPassword = async (req, res) => {
  res.json({ message: 'Password reset logic would go here' });
};
