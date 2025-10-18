// Registation
exports.RegistationDTO = (username, email, password) => ({ username, email, password })
exports.RegistationResDTO = (token, message = "Registation Successfull") => ({ success: true, token, message })

// verify email
exports.EmailVerifyDTO = (token, otp) => ({ token, otp })
exports.EmailVerifyResDTO = (message = "Account Verification Successful") => ({ success: true, message })

// login
exports.LoginDTO = (email, password) => ({ email, password })
exports.LoginResDTO = (token, user, message = "Login Success") => ({
    success: true,
    token, message,
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
})

// forget password
exports.ForgetPasswordDTO = (email) => ({ email })
exports.ForgetPasswordResDTO = (token, message = "Email Verification Success, Verification email sent.") => ({ token, message })

// verify OTP
exports.VerifyOTPDTO = (token, otp) => ({ token, otp })
exports.VerifyOTPResDTO = (message ="OTP Verification Success") => ({ success: true, message })

// update Password
exports.UpdatePasswordDTO = (token, newpassword) => ({ token, newpassword })
exports.UpdatePasswordResDTO = (message = "Password Updated Successful") => ({ success: true, message })

// Logout
exports.LogoutResDTO = (message = "Logout successful") => ({ success: true, message });

// Error 
exports.ErrorResDTO = (message = "Something went wrong") => ({ success: false, message })