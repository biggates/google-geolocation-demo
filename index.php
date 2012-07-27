<!doctype html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="style/style.css" type="text/css" media="all" />
        <title>Google Geolocation Test</title>
    </head>
    <body>
        <form>
            <h2>basic settings<a href="javascript:;" id="toggle_basic_settings" class="button">+</a></h2>
            <div id="basic_settings" style="display:none;">
                <label for="version">version</label><input id="version" name="version" type="text" value="1.1.0" /> <br />
                <label for="host">host</label><input id="host" name="host" type="text" value="maps.google.com" /> <br />
                <label for="home_mobile_country_code">home_mobile_country_code</label><input id="home_mobile_country_code" type="number" name="home_mobile_country_code" value="460" /> <br />
                <label for="home_mobile_network_code">home_mobile_network_code</label><input id="home_mobile_network_code" type="number" name="home_mobile_network_code" value="15" /> <br />
                <label for="radio_type">radio_type</label><input id="radio_type" type="text" name="radio_type" value="gsm" /> <br />
                <label for="request_address">request_address</label><input id="request_address" type="checkbox" name="request_address" value="true" /> <br />
            </div>
            <h2>cell towers
                <a href="javascript:;" class="button" id="button_add_tower">+</a></h2>
            <ul id="cell_towers_section">
                <!--
                <li>
                <label for="cell_id_1">cell_id</label><input id="cell_id_1" type="text" name="cell_id_1" value="" /><br />
                <label for="signal_strength_1">signal_strength(dBm)</label><input id="signal_strength_1" name="signal_strength_1" value="" /><br />
                <label for="location_area_code _1">location_area_code (LAC)</label><input id="location_area_code_1" name="location_area_code_1" value="" /><br />
                <a href="" class="button">-</a>
                </li>
                -->
            </ul>
            <input id="form_submit" type="submit" />
            <a href="javascript:;" id="test_map" class="button">Map Test</a>
            <a href="javascript:;" id="clear_markers" class="button">Clear Markers</a>
            <div class="clear_fix"></div>
        </form>
        <div id="post_result"></div>
        <div id="map_canvas"></div>
        <footer>brought you by biggates</footer>
    </body>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false&language=zh-CN"></script>
    <script type="text/javascript" src="js/main.js"></script>
</html>