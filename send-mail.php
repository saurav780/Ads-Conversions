<?php
header('Content-Type: application/json');

$to = 'saurav@adsconversions.com,connect@adsconversions.com';
$subject = 'New Lead from Ads Conversions Contact Form';

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$email = trim($_POST['email'] ?? '');
$business = trim($_POST['business'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$email && !$phone) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide an email or phone number.']);
    exit;
}

$body = "You have received a new contact form submission from Ads Conversions.\n\n";
$body .= "Name: $name\n";
$body .= "Phone: $phone\n";
$body .= "Email: $email\n";
$body .= "Business / Website: $business\n\n";
$body .= "Message:\n$message\n";

$headers = [];
$headers[] = 'From: ' . ($email ?: 'noreply@adsconversions.com');
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$mailSent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailer failed. Please try again later.']);
}
