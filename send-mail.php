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

$submissionDir = __DIR__ . '/submissions';
if (!is_dir($submissionDir)) {
    mkdir($submissionDir, 0777, true);
}

$submissionFile = $submissionDir . '/submission-' . time() . '-' . bin2hex(random_bytes(4)) . '.txt';
$submissionBody = "Name: $name\nPhone: $phone\nEmail: $email\nBusiness / Website: $business\n\nMessage:\n$message\n";
file_put_contents($submissionFile, $submissionBody);

$body = "You have received a new contact form submission from Ads Conversions.\n\n";
$body .= $submissionBody;

$headers = [];
$headers[] = 'From: ' . ($email ?: 'noreply@adsconversions.com');
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers));

echo json_encode([
    'success' => true,
    'message' => 'Message received successfully.',
    'mailSent' => $mailSent
]);
