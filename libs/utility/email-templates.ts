// On board tenant
export function createPasswordHtml(
  firstName: string,
  tenantName: string,
  encryptedToken: string,
  link: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Dear ${firstName},</p>

    <p>Welcome to <strong>${tenantName}</strong>! We’re excited to have you on board. You now have access to the full suite of tools and features.</p>

    <p>To get started, create your new password on your admin dashboard <a href="${link}?token=${encryptedToken}" style="color: #1a73e8;">here</a>.</p>

    <p>If you need any assistance, feel free to reach out to our support team.</p>

    <p>Best regards,<br>${tenantName}</p>
</body>
</html>
`;
}

// forget password
export function resetPasswordHtml(
  firstName: string,
  tenantName: string,
  encryptedToken: string,
  link: string,
) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Dear ${firstName},</p>
    
    <p>We received a request to reset your password for your <strong>${tenantName}</strong> account.</p>
    
    <p>To reset your password, click on the link below:</p>
    
    <p><a href="${link}?token=${encryptedToken}" style="color: #1a73e8;">Reset Password</a></p>
    
    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    
    <p>If you need any assistance, feel free to reach out to our support team.</p>
    
    <p>Best regards,<br>${tenantName}</p>
</body>
</html>

  `;
}

export function createSubAdminHtml(
  firstName: string,
  tenantName: string,
  encryptedToken: string,
  link: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Dear ${firstName},</p>
    
    <p>We’re happy to inform you that you’ve been added as a Sub Admin to <strong>${tenantName}</strong>. You now have administrative privileges to manage users assigned to you.</p>
    
    <p>Create your password and log in to your dashboard here: <a href="${link}?token=${encryptedToken}"  style="color: #1a73e8;">Click here</a></p>
    
    <p>Feel free to reach out if you have any questions or need assistance getting started.</p>
    
    <p>Best regards,<br>${tenantName}</p>
</body>
</html>
  `;
}

export function createSubAdminReAssignHtml(
  firstName: string,
  groupName: string,
  tenantName: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Dear ${firstName},</p>
    
    <p>We’re happy to inform you that you’ve been added as a Sub Admin to <strong>${groupName}</strong> group(s). You now have administrative privileges to manage users assigned to you.</p>
        
    <p>Feel free to reach out if you have any questions or need assistance getting started.</p>
    
    <p>Best regards,<br>${tenantName}</p>
</body>
</html>
  `;
}

export function createUserEnrollmentToPromotionHtml(
  userName: string,
  promotionName: string,
  tenantName: string,
  link: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hi ${userName},</p>
    
    <p>Exciting news! You've been enrolled in the <strong>${promotionName}</strong>! Keep an eye on your progress and take advantage of the exciting rewards available.</p>
    
    <p>You can create your password and log in to view your promotion details here: <a href="${link}" style="color: #1a73e8;">check here</a></p>
    
    <p>Good luck, and feel free to reach out if you have any questions!</p>
    
    <p>Best regards,<br>${tenantName}</p>
</body>
</html>
`;
}

export function createTripQualificationHtml(
  userName: string,
  destination: string,
  tenantName: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hi ${userName},</p>
    
    <p>Congratulations! You've qualified for the upcoming trip to <strong>${destination}</strong>! We’re thrilled to recognize your achievement and look forward to celebrating with you.</p>
    
    <p>We’ll be sending more details about the trip soon, so stay tuned!</p>
    
    <p>Best regards,<br>${tenantName}</p>
</body>
</html>
`;
}

export function createAnnouncementHtml(
  name: string,
  message: string,
  tenantName: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hi ${name},</p>
    <p>${message}</p>

  <p>Feel free to reach out if you have any questions or need any assistance.</p>

   <h3>Dont reply to this email</h3>
    
  <p>Best regards,<br>${tenantName}</p>
</body>
</html>`;
}

// return `<h2>Hi ${firstName}</h2>
//   <p>Please click on the following link to create your password:</p>
//   <p><a href="${link}?token=${encryptedToken}">Create Password</a></p>
//   <p>If you did not request this, please ignore this email.</p>`;
