<?php

$host = 'http://www.google.com/loc/json';

$logname = './json.log';
$request = @file_get_contents('php://input');

file_put_contents($logname, $request);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $host);
#curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
#curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($request)
));

$result = curl_exec($ch);

curl_close($ch);
?>