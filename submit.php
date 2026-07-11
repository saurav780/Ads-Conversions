<?php
function isAjaxRequest() {
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        return true;
    }

    if (!empty($_SERVER['HTTP_ACCEPT'])) {
        return str_contains(strtolower($_SERVER['HTTP_ACCEPT']), 'application/json');
    }

    return false;
}

function sendJson($success, $message, $httpCode = 200, $extra = []) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($httpCode);
    $payload = ['success' => $success, 'message' => $message];
    if ($extra) {
        $payload = array_merge($payload, $extra);
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitizeText($value) {
    $value = trim((string) ($value ?? ''));
    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
    return $value;
}

function sanitizeEmail($value) {
    return strtolower(trim((string) ($value ?? '')));
}

function sanitizePhone($value) {
    return preg_replace('/[^0-9+()\-\s]/', '', trim((string) ($value ?? '')));
}

function sanitizeWebsite($value) {
    $value = trim((string) ($value ?? ''));
    if ($value === '') {
        return '';
    }
    $value = filter_var($value, FILTER_SANITIZE_URL);
    if ($value === false) {
        return '';
    }
    if (!preg_match('~^(https?:)?//~i', $value) && strpos($value, '://') === false) {
        $value = 'https://' . ltrim($value, '/');
    }
    return $value;
}

function containsHeaderInjection($value) {
    return preg_match('/[\r\n]/', $value) === 1;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Only POST requests are allowed.', 405);
}

$name = sanitizeText($_POST['name'] ?? '');
$phone = sanitizePhone($_POST['phone'] ?? '');
$email = sanitizeEmail($_POST['email'] ?? '');
$website = sanitizeWebsite($_POST['website'] ?? $_POST['business'] ?? '');
$message = sanitizeText($_POST['message'] ?? '');

if ($name === '') {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter your name.', 400);
}

if ($phone === '') {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter your mobile number.', 400);
}

if ($email === '') {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter your email address.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter a valid email address.', 400);
}

if (!preg_match('/^\+?[0-9\s()-]{7,15}$/', $phone)) {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter a valid mobile number.', 400);
}

if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Please enter a valid website URL.', 400);
}

if (containsHeaderInjection($name) || containsHeaderInjection($phone) || containsHeaderInjection($email) || containsHeaderInjection($website) || containsHeaderInjection($message)) {
    if (!isAjaxRequest()) {
        header('Location: /thank-you.html');
        exit;
    }
    sendJson(false, 'Invalid form data detected.', 400);
}

$to = 'connect@adsconversions.com,saurav@adsconversions.com';
$subject = 'New Lead from AdsConversions Website';
$submittedAt = gmdate('Y-m-d H:i:s \U\T\C');
$submittedLocal = date('Y-m-d H:i:s');
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

$body = "You have received a new lead submission from the AdsConversions website.\n\n";
$body .= "Name: $name\n";
$body .= "Mobile Number: $phone\n";
$body .= "Email: $email\n";
$body .= "Website: " . ($website !== '' ? $website : 'Not provided') . "\n";
$body .= "Message: " . ($message !== '' ? $message : 'No additional message provided') . "\n\n";
$body .= "Submission Date (Local): $submittedLocal\n";
$body .= "Submission Date (UTC): $submittedAt\n";
$body .= "IP Address: $ipAddress\n";
$body .= "User-Agent: $userAgent\n";

$headers = [];
$headers[] = 'From: AdsConversions <connect@adsconversions.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . PHP_VERSION;

$submissionDir = __DIR__ . '/submissions';
if (!is_dir($submissionDir)) {
    if (!mkdir($submissionDir, 0755, true) && !is_dir($submissionDir)) {
        sendJson(false, 'Unable to prepare the storage directory.', 500);
    }
}

$submissionFile = $submissionDir . '/submission-' . time() . '-' . bin2hex(random_bytes(4)) . '.txt';
$submissionBody = "Name: $name\n";
$submissionBody .= "Mobile Number: $phone\n";
$submissionBody .= "Email: $email\n";
$submissionBody .= "Website: " . ($website !== '' ? $website : 'Not provided') . "\n";
$submissionBody .= "Message: " . ($message !== '' ? $message : 'No additional message provided') . "\n";
$submissionBody .= "Submission Date (Local): $submittedLocal\n";
$submissionBody .= "Submission Date (UTC): $submittedAt\n";
$submissionBody .= "IP Address: $ipAddress\n";
$submissionBody .= "User-Agent: $userAgent\n";

if (@file_put_contents($submissionFile, $submissionBody) === false) {
    sendJson(false, 'The submission could not be saved securely.', 500);
}

$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($mailSent) {
    sendJson(true, 'Thank you! Your message has been sent successfully.', 200, ['mailSent' => true]);
}

sendJson(true, 'Thank you! Your message has been received and will be reviewed shortly.', 200, ['mailSent' => false]);
