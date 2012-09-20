<?php
require('remote.inc.php');
require('conn.php');

// input
$request = @file_get_contents('php://input');

$request_decoded = json_decode($request);
$request_cell_towers = $request_decoded->cell_towers;

// echo back
$echo_result = array();

// query each cell tower
foreach($request_cell_towers as $cell_tower){
    $cell_id = $cell_tower->cell_id;
    $lac = $cell_tower->location_area_code;
    $signal_strength = $cell_tower->signal_strength;
    
    $sql = "SELECT * FROM `cell_tower_gsm` WHERE `cell_id` = '$cell_id' AND `lac` = '$lac' AND `signal_strength` = '$signal_strength'";
    
    $cachedData = $db->query($sql);

    $isCached = false;
    
    if($cachedData === 0){
        $isCached = false;
    } else {
        $isCached = true;
    }
    
    $latitude = 0.0;
    $longitude = 0.0;
    $accuracy = 0.0;
    
    if($isCached){
        // load from MySQL
        $cachedData = $cachedData[0];
        $latitude = floatval($cachedData['latitude']);
        $longitude = floatval($cachedData['longitude']);
        $accuracy = floatval($cachedData['accuracy']);
    } else {
        // 请求 google
        $thisRequest = array(
            'version'   => $request_decoded->version,
            'host'      => $request_decoded->host,
            'radio_type'=> $request_decoded->radio_type,
            'home_mobile_country_code'  => $request_decoded->home_mobile_country_code,
            'home_mobile_network_code'  => $request_decoded->home_mobile_network_code,
            'cell_towers'   => array(
                array(
                    'cell_id'   => $cell_id,
                    'location_area_code'    => $lac,
                    'signal_strength'       => $signal_strength
                )
            ),
        );
        $thisRequest = (object)$thisRequest;
        
        $googleResult = google(json_encode($thisRequest));
        
        // write in MySQL
        
        $latitude = floatval($googleResult->location->latitude);
        $longitude = floatval($googleResult->location->longitude);
        $accuracy = floatval($googleResult->location->accuracy);
        
        if($latitude < 1.0 && $longitude < 1.0){
            // error
            continue;
        }
        
        $sql = <<<END
INSERT INTO `cell_tower_gsm` 
SET `cell_id` = '$cell_id',
    `lac` = '$lac',
    `signal_strength` = '$signal_strength',
    `latitude` = '$latitude',
    `longitude` = '$longitude',
    `accuracy` = '$accuracy'
END;
        
        $db->query($sql);
    }
    
    $thisResult = array(
        'cell_id'   => $cell_id,
        'lac'       => $lac,
        'signal_strength' => $signal_strength,
        'latitude'  => $latitude,
        'longitude' => $longitude,
        'accuracy' => $accuracy
    );
    
    $thisResult = (object)$thisResult;
    $echo_result[] = $thisResult;
}

$result = json_encode($echo_result);

echo $result;
?>
